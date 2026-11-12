import fs from "node:fs/promises";
import path from "node:path";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse, type NextRequest } from "next/server";
import { getAdmin } from "@/lib/admin/session";
import { MAX_UPLOAD_BYTES, UPLOAD_CONTENT_TYPES, blobToken, storageProblem } from "@/lib/admin/storage";

export const dynamic = "force-dynamic";

/**
 * Production: issues a short-lived token so the browser uploads straight to
 * Vercel Blob (no size limit from our server). Local development without a
 * Blob token: accepts the file and stores it in /public/uploads.
 */
export async function POST(request: NextRequest) {
  if (!(await getAdmin())) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const token = blobToken();
  if (token) {
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

  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: storageProblem() }, { status: 500 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const pathname = String(form.get("pathname") ?? "");
  if (!(file instanceof File) || !/^[a-z0-9-]+\/[a-z0-9.-]+$/.test(pathname)) {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }
  const ext = path.extname(pathname);
  const name = `${pathname.slice(0, -ext.length)}-${Date.now().toString(36)}${ext}`;
  const target = path.join(process.cwd(), "public", "uploads", name);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/uploads/${name}` });
}
