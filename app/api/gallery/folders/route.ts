import { NextResponse } from "next/server";
import { getGalleryFolders, getGalleryImages, createGalleryFolder } from "@/lib/cloudinary";

/**
 * GET /api/gallery/folders
 * Returns all gallery folders with their photo counts.
 */
export async function GET() {
  try {
    const images = await getGalleryImages();
    const folders = await getGalleryFolders(images);
    return NextResponse.json({ folders });
  } catch (err) {
    console.error("Failed to fetch folders:", err);
    return NextResponse.json({ error: "Failed to fetch folders" }, { status: 500 });
  }
}

/**
 * POST /api/gallery/folders
 * Create a new folder under dips-gallery/ in Cloudinary.
 * Protected by admin password.
 */
export async function POST(request: Request) {
  try {
    const adminPassword = request.headers.get("x-admin-password");
    if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { folderName } = await request.json();
    if (!folderName || typeof folderName !== "string" || !folderName.trim()) {
      return NextResponse.json({ error: "Invalid folder name" }, { status: 400 });
    }

    const created = await createGalleryFolder(folderName);
    return NextResponse.json({ success: true, folder: created });
  } catch (err) {
    console.error("Failed to create folder:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Failed to create folder" },
      { status: 500 }
    );
  }
}
