"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Photo = {
  secure_url: string;
  width: number;
  height: number;
  public_id: string;
};

function getOptimizedUrl(url: string, width = 800) {
  if (!url) return url;
  if (url.includes("/upload/")) {
    return url.replace("/upload/", `/upload/w_${width},c_limit,q_auto,f_auto/`);
  }
  return url;
}

export default function HomeGalleryPreview() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gallery/images?limit=8")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        const list: Photo[] = (data.images || data || []).slice(0, 8);
        setPhotos(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`rounded-3xl bg-meadow-light/60 animate-pulse ${
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
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`rounded-3xl bg-meadow-light/50 grid place-items-center ${
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
      {photos.map((photo, i) => {
        const optimizedSrc = getOptimizedUrl(photo.secure_url, i === 0 ? 1000 : 600);
        return (
          <div
            key={photo.public_id || i}
            className={`rounded-3xl overflow-hidden bg-meadow-light relative shadow-xs hover:shadow-md transition-shadow ${
              i === 0 ? "col-span-2 row-span-2" : ""
            }`}
            style={{ aspectRatio: "1 / 1" }}
          >
            <Image
              src={optimizedSrc}
              alt="DIPS school photo"
              width={photo.width || 600}
              height={photo.height || 600}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              sizes={i === 0 ? "(max-width:768px) 100vw, 50vw" : "(max-width:768px) 50vw, 25vw"}
              loading={i < 3 ? "eager" : "lazy"}
            />
          </div>
        );
      })}
    </div>
  );
}
