import fs from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse, type NextRequest } from "next/server";
import { getAdmin } from "@/lib/admin/session";
import { MAX_UPLOAD_BYTES, UPLOAD_CONTENT_TYPES, blobToken, storageProblem } from "@/lib/admin/storage";

export const dynamic = "force-dynamic";

const VALID_PATHNAME = /^[a-z0-9-]+\/[a-z0-9.-]+$/;

/**
 * Two ways in:
 * - multipart form (photos up to ~4 MB): the server stores the file itself, in
 *   Vercel Blob or, locally without a token, in /public/uploads. Errors come
 *   back as a readable message.
 * - JSON (larger files, i.e. videos): issues a short-lived token so the browser
 *   uploads straight to Vercel Blob, bypassing the 4.5 MB request limit.
 */
export async function POST(request: NextRequest) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const token = blobToken();

  if (request.headers.get("content-type")?.startsWith("multipart/form-data")) {
    const form = await request.formData();
    const file = form.get("file");
    const pathname = String(form.get("pathname") ?? "");
    if (!(file instanceof File) || !VALID_PATHNAME.test(pathname)) {
      return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
    }
    if (!(UPLOAD_CONTENT_TYPES as readonly string[]).includes(file.type)) {
      return NextResponse.json({ error: "This file type is not supported. Please use JPG, PNG, WebP or MP4." }, { status: 400 });
    }

    if (token) {
      try {
        const blob = await put(pathname, file, { access: "public", token, addRandomSuffix: true, contentType: file.type });
        return NextResponse.json({ url: blob.url });
      } catch (err) {
        console.error("[upload] blob put failed", err);
        return NextResponse.json({ error: `Upload failed: ${(err as Error).message}` }, { status: 502 });
      }
    }
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: storageProblem() }, { status: 500 });
    }
    const ext = path.extname(pathname);
    const name = `${pathname.slice(0, -ext.length)}-${Date.now().toString(36)}${ext}`;
    const target = path.join(process.cwd(), "public", "uploads", name);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ url: `/uploads/${name}` });
  }

  if (!token) return NextResponse.json({ error: storageProblem() ?? "File storage is not configured." }, { status: 500 });
  const body = (await request.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      token,
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [...UPLOAD_CONTENT_TYPES],
        maximumSizeInBytes: MAX_UPLOAD_BYTES,
        addRandomSuffix: true,
      }),
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
