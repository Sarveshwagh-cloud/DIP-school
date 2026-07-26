import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Gallery | DIPS Umred",
  description: "Moments from life at Deoraoji Itankar Public School, Umred — classrooms, activities and campus life.",
};

const photos = [
  "https://www.dipsumred.org/wp-content/uploads/2022/06/DSC_9986.jpg",
  "https://www.dipsumred.org/wp-content/uploads/2022/06/DSC_7473.jpg",
  "https://www.dipsumred.org/wp-content/uploads/2022/06/DSC_7435.jpg",
  "https://www.dipsumred.org/wp-content/uploads/2022/06/DSC_7630.jpg",
  "https://www.dipsumred.org/wp-content/uploads/2019/04/05-3.jpg",
  "https://www.dipsumred.org/wp-content/uploads/2019/04/IMG-20190410-WA0055.jpg",
];

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Moments from our garden"
        subtitle="A glimpse of everyday life at DIPS — learning, playing and growing together."
      />

      <section className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((src) => (
            <div key={src} className="reveal rounded-3xl overflow-hidden aspect-[4/3] bg-meadow-light bg-cover bg-center hover:-translate-y-1 transition" style={{ backgroundImage: `url('${src}')` }} />
          ))}
        </div>
        <p className="text-center text-ink/45 text-sm mt-8">More photos coming soon.</p>
      </section>
    </>
  );
}
