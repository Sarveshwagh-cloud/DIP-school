import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import GalleryView, { PhotoItem, FolderItem } from "@/components/GalleryView";
import { getGalleryImages, getGalleryFolders, getOptimizedUrl } from "@/lib/cloudinary";

export const metadata: Metadata = {
  title: "School Gallery | DIPS Umred",
  description: "Explore moments from Deoraoji Itankar Public School, Umred — Annual Day 2026, School Captain Election, Shiv Jayanti, and campus life.",
};

export const revalidate = 60; // Revalidate every 60 seconds

export default async function GalleryPage() {
  const [cloudImages, folders] = await Promise.all([
    getGalleryImages(),
    getGalleryFolders(),
  ]);

  const photos: PhotoItem[] = cloudImages.map((img, i) => ({
    id: i,
    publicId: img.public_id,
    src: getOptimizedUrl(img.public_id, 800),
    fullSrc: getOptimizedUrl(img.public_id, 1600),
    width: img.width,
    height: img.height,
    folder: img.folder,
    folderName: img.folderName,
    alt: `${img.folderName} photo ${i + 1}`,
  }));

  const folderItems: FolderItem[] = folders.map((f) => ({
    slug: f.slug,
    name: f.name,
    count: f.count,
  }));

  return (
    <>
      <PageHero
        eyebrow="School Memories"
        title="Event Gallery & Life at DIPS"
        subtitle="Explore moments from Annual Day 2026, School Captain Elections, Shiv Jayanti celebrations, and daily campus milestones."
      />

      <GalleryView photos={photos} folders={folderItems} />
    </>
  );
}

