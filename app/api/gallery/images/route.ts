import { NextResponse } from "next/server";
import { getGalleryImages } from "@/lib/cloudinary";

/**
 * GET /api/gallery/images
 * Returns all gallery images from Cloudinary.
 * Protected by ADMIN_PASSWORD header (for admin panel).
 * Public gallery page uses this too but without auth (read-only is fine).
 */
export async function GET(request: Request) {
  // If admin password header is present, validate it
  const adminPassword = request.headers.get("x-admin-password");
  const isAdminRequest = !!adminPassword;

  if (isAdminRequest && adminPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const limitParam = url.searchParams.get("limit");
    let images = await getGalleryImages();
    if (limitParam) {
      const limit = parseInt(limitParam, 10);
      if (!isNaN(limit) && limit > 0) {
        images = images.slice(0, limit);
      }
    }
    return NextResponse.json({ images });
  } catch (err) {
    console.error("Failed to fetch gallery images:", err);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}
