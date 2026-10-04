"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Photo = {
  secure_url: string;
  width: number;
  height: number;
  public_id: string;
};

export default function HomeGalleryPreview() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gallery/folders")
      .then((r) => r.json())
      .then(async (data) => {
        // Fetch images from the first available folder, or all root images
        const folders = data.folders as { slug: string; count: number }[];
        if (!folders || folders.length === 0) {
          setLoading(false);
          return;
        }

        // Fetch actual images
        const res = await fetch("/api/gallery/images");
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const imgs = await res.json();
        const list: Photo[] = (imgs.images || imgs || []).slice(0, 8);
        setPhotos(list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`rounded-3xl bg-meadow-light animate-pulse ${
              i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
            }`}
          />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`rounded-3xl bg-meadow-light grid place-items-center ${
              i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
            }`}
          >
            <span className="text-4xl opacity-30">📷</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {photos.map((photo, i) => (
        <div
          key={photo.public_id}
          className={`rounded-3xl overflow-hidden bg-meadow-light ${
            i === 0 ? "col-span-2 row-span-2" : ""
          }`}
          style={{ aspectRatio: "1 / 1" }}
        >
          <Image
            src={photo.secure_url}
            alt="DIPS school photo"
            width={photo.width || 600}
            height={photo.height || 600}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            sizes={i === 0 ? "(max-width:768px) 50vw, 25vw" : "(max-width:768px) 50vw, 25vw"}
          />
        </div>
      ))}
    </div>
  );
}
