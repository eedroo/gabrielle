import { NextResponse, type NextRequest } from "next/server";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

/** /whatsapp?text=… → wa.me with the number saved in the backoffice. */
export async function GET(request: NextRequest) {
  const { whatsapp_number } = await getSettings();
  const number = whatsapp_number.replace(/\D/g, "");
  const text = request.nextUrl.searchParams.get("text");
  const target = new URL(`https://wa.me/${number}`);
  if (text) target.searchParams.set("text", text.slice(0, 4000));
  return NextResponse.redirect(target, { status: 302, headers: { "X-Robots-Tag": "noindex" } });
}
