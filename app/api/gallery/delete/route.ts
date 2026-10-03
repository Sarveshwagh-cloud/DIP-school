import { NextResponse } from "next/server";
import { deleteGalleryImage } from "@/lib/cloudinary";

/**
 * POST /api/gallery/delete
 * Deletes a single image from Cloudinary by public_id.
 * Protected by ADMIN_PASSWORD header check.
 */
export async function POST(request: Request) {
  try {
    const adminPassword = request.headers.get("x-admin-password");
    if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { publicId } = await request.json();
    if (!publicId) {
      return NextResponse.json({ error: "Missing publicId" }, { status: 400 });
    }

    const result = await deleteGalleryImage(publicId);
    return NextResponse.json({ result });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
