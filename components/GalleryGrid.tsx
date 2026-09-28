"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export default function GalleryGrid({ 
  photos 
}: { 
  photos: { id: number; src: string; width: number; height: number; alt: string }[] 
}) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  // Handle keyboard navigation (escape to close, arrows for next/prev)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedPhotoIndex === null) return;
    
    if (e.key === "Escape") setSelectedPhotoIndex(null);
    if (e.key === "ArrowRight") {
      setSelectedPhotoIndex((prev) => (prev !== null && prev < photos.length - 1 ? prev + 1 : prev));
    }
    if (e.key === "ArrowLeft") {
      setSelectedPhotoIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
    }
  }, [selectedPhotoIndex, photos.length]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    if (selectedPhotoIndex !== null) {
      document.body.style.overflow = "hidden"; // Prevent scrolling when lightbox is open
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [handleKeyDown, selectedPhotoIndex]);

  const selectedPhoto = selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null;

  return (
    <>
      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {photos.map((photo, index) => (
          <div 
            key={photo.id} 
            className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 bg-gray-100"
            onClick={() => setSelectedPhotoIndex(index)}
          >
            {/* 
              Next.js Image component ensures fast loading, WebP format, 
              and correct sizing based on the device width.
              priority={index < 4} loads the first 4 images immediately without lazy loading.
            */}
            <Image 
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              priority={index < 6}
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <span className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-white font-medium text-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
                View
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 backdrop-blur-md p-4 transition-opacity duration-300"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 text-white/70">
            <span className="text-sm font-medium bg-black/30 px-3 py-1 rounded-full backdrop-blur-md">
              {selectedPhotoIndex! + 1} / {photos.length}
            </span>
            <button 
              className="hover:text-white bg-black/20 hover:bg-black/50 rounded-full p-2.5 backdrop-blur-md transition-all"
              onClick={(e) => { e.stopPropagation(); setSelectedPhotoIndex(null); }}
              title="Close (Esc)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          {/* Previous Button */}
          {selectedPhotoIndex! > 0 && (
            <button 
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-black/20 hover:bg-black/50 rounded-full p-4 backdrop-blur-md transition-all z-10 hidden sm:block"
              onClick={(e) => { e.stopPropagation(); setSelectedPhotoIndex(selectedPhotoIndex! - 1); }}
              title="Previous (Left Arrow)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
          )}

          {/* Image Container */}
          <div 
            className="relative w-full max-w-6xl max-h-[85vh] flex items-center justify-center animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 
              Using standard img tag in lightbox because next/image here might be 
              over-optimized and we want the original high-res version to load as-is.
              Also avoids layout shift issues in fixed positioning.
            */}
            <img 
              src={selectedPhoto.src} 
              alt={selectedPhoto.alt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Next Button */}
          {selectedPhotoIndex! < photos.length - 1 && (
            <button 
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-black/20 hover:bg-black/50 rounded-full p-4 backdrop-blur-md transition-all z-10 hidden sm:block"
              onClick={(e) => { e.stopPropagation(); setSelectedPhotoIndex(selectedPhotoIndex! + 1); }}
              title="Next (Right Arrow)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          )}
        </div>
      )}
    </>
  );
}
