import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import GalleryGrid from "@/components/GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery | DIPS Umred",
  description: "Moments from life at Deoraoji Itankar Public School, Umred — Annual Day, classrooms, activities and campus life.",
};

// You can easily replace these with your actual Annual Day photos.
// For a masonry layout, providing actual width and height helps next/image optimize rendering.
const heights = [400, 500, 600, 450, 550, 480];
const photos = Array.from({ length: 24 }).map((_, i) => {
  const height = heights[i % heights.length];
  return {
    id: i,
    src: `https://picsum.photos/seed/dipsannual${i}/800/${height}`,
    width: 800,
    height: height,
    alt: `Annual Day Moment ${i + 1}`,
  };
});

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Annual Day & Campus Life"
        subtitle="A glimpse of vibrant performances, celebrations, and everyday learning at DIPS."
      />

      <section className="max-w-[1400px] mx-auto px-5 py-16 md:py-24">
        <GalleryGrid photos={photos} />
        
        <div className="mt-20 text-center">
          <div className="inline-block p-1 rounded-full bg-meadow-light/50 border border-meadow-light mb-4">
             <span className="px-4 py-1 text-sm text-meadow font-medium">End of Gallery</span>
          </div>
          <p className="text-ink/60">More photos will be added in upcoming events.</p>
        </div>
      </section>
    </>
  );
}
