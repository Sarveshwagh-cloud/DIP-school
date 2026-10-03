import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

// Folder where gallery images are stored in Cloudinary
export const GALLERY_FOLDER = "dips-gallery";

export type GalleryImage = {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  created_at: string;
  bytes: number;
  folder: string;
  folderName: string;
};

export type GalleryFolder = {
  slug: string;
  name: string;
  count: number;
};

/**
 * Standard known events / folders for DIPS Umred.
 */
export const DEFAULT_FOLDERS: { slug: string; name: string }[] = [
  { slug: "annual-day-2026", name: "Annual Day 2026" },
  { slug: "school-captain-election", name: "School Captain Election" },
  { slug: "shiv-jayanti-2026", name: "Shiv Jayanti 2026" },
];

/**
 * Map slug to friendly display title.
 */
export function formatFolderDisplayName(slug: string): string {
  const map: Record<string, string> = {
    "annual-day-2026": "Annual Day 2026",
    "annual-day-26": "Annual Day 2026",
    "school-captain-election": "School Captain Election",
    "school-caption-election": "School Captain Election",
    "shiv-jayanti-2026": "Shiv Jayanti 2026",
    "shiv-janati-2026": "Shiv Jayanti 2026",
  };
  if (map[slug.toLowerCase()]) return map[slug.toLowerCase()];

  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

/**
 * Extract folder slug from Cloudinary public_id.
 * E.g. "dips-gallery/school-captain-election/img123" -> "school-captain-election"
 * E.g. "dips-gallery/img123" -> "annual-day-2026" (for existing Annual Day photos)
 */
export function extractFolderFromPublicId(publicId: string): string {
  const parts = publicId.split("/");
  if (parts.length > 2) {
    return parts[1];
  }
  // Default to Annual Day for previously uploaded root photos
  return "annual-day-2026";
}

/**
 * Fetch all images from the gallery folder in Cloudinary.
 * Uses the Admin API to list resources by folder.
 */
export async function getGalleryImages(): Promise<GalleryImage[]> {
  const images: GalleryImage[] = [];
  let nextCursor: string | undefined;

  // Paginate through all images (Cloudinary returns max 500 per request)
  do {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: GALLERY_FOLDER,
      max_results: 500,
      next_cursor: nextCursor,
    });

    for (const resource of result.resources) {
      const folder = extractFolderFromPublicId(resource.public_id);
      images.push({
        public_id: resource.public_id,
        secure_url: resource.secure_url,
        width: resource.width,
        height: resource.height,
        format: resource.format,
        created_at: resource.created_at,
        bytes: resource.bytes,
        folder,
        folderName: formatFolderDisplayName(folder),
      });
    }

    nextCursor = result.next_cursor;
  } while (nextCursor);

  // Sort by newest first
  images.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return images;
}

/**
 * Get all gallery folders, combining default presets with any dynamic subfolders in Cloudinary.
 */
export async function getGalleryFolders(imagesList?: GalleryImage[]): Promise<GalleryFolder[]> {
  try {
    const res = await cloudinary.api.sub_folders(GALLERY_FOLDER);
    const subfolderNames = (res.folders || []).map((f: { name: string }) => f.name);

    // Combine defaults and any remote subfolders
    const allSlugs = Array.from(
      new Set([...DEFAULT_FOLDERS.map((d) => d.slug), ...subfolderNames])
    );

    // If images are provided, compute count per folder
    const counts: Record<string, number> = {};
    if (imagesList) {
      for (const img of imagesList) {
        counts[img.folder] = (counts[img.folder] || 0) + 1;
      }
    }

    return allSlugs.map((slug) => ({
      slug,
      name: formatFolderDisplayName(slug),
      count: counts[slug] || 0,
    }));
  } catch (err) {
    console.error("Failed to fetch subfolders from Cloudinary:", err);
    return DEFAULT_FOLDERS.map((f) => ({
      ...f,
      count: imagesList ? imagesList.filter((img) => img.folder === f.slug).length : 0,
    }));
  }
}

/**
 * Create a new folder in Cloudinary under dips-gallery/.
 */
export async function createGalleryFolder(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!slug) {
    throw new Error("Invalid folder name");
  }

  const fullPath = `${GALLERY_FOLDER}/${slug}`;
  await cloudinary.api.create_folder(fullPath);

  return {
    slug,
    name: formatFolderDisplayName(slug),
    fullPath,
  };
}

/**
 * Generate an optimized Cloudinary URL for the given public_id.
 * Automatically serves WebP/AVIF, resizes for the container, and applies quality auto.
 */
export function getOptimizedUrl(publicId: string, width = 800): string {
  return cloudinary.url(publicId, {
    fetch_format: "auto",
    quality: "auto",
    width,
    crop: "limit",
    secure: true,
  });
}

/**
 * Delete an image from Cloudinary by public_id.
 */
export async function deleteGalleryImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}

/**
 * Generate a signed upload signature for client-side uploads.
 * This avoids exposing the API secret on the client.
 */
export function generateUploadSignature(paramsToSign: Record<string, string>) {
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );
  return signature;
}
