import { NextResponse } from "next/server";
import cloudinary, { GALLERY_FOLDER } from "@/lib/cloudinary";

/**
 * POST /api/gallery/sign
 * Generates a signed upload signature for the Cloudinary Upload Widget.
 * Protected by ADMIN_PASSWORD check.
 */
export async function POST(request: Request) {
  try {
    const adminPassword = request.headers.get("x-admin-password");
    if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paramsToSign } = await request.json();

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({ signature });
  } catch {
    return NextResponse.json({ error: "Failed to sign" }, { status: 500 });
  }
}
