"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

export type PhotoItem = {
  id: number;
  publicId: string;
  src: string;
  fullSrc: string;
  width: number;
  height: number;
  folder: string;
  folderName: string;
  alt: string;
};

export type FolderItem = {
  slug: string;
  name: string;
  count: number;
};

interface GalleryViewProps {
  photos: PhotoItem[];
  folders: FolderItem[];
}

export default function GalleryView({ photos, folders }: GalleryViewProps) {
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const tabContainerRef = useRef<HTMLDivElement>(null);

  // Touch tracking for mobile swipe in lightbox
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Compute actual counts for folders based on current photos
  const folderCounts = folders.reduce<Record<string, number>>((acc, f) => {
    acc[f.slug] = photos.filter((p) => p.folder === f.slug).length;
    return acc;
  }, {});

  // Filter photos based on selected tab
  const filteredPhotos =
    selectedFolder === "all"
      ? photos
      : photos.filter((p) => p.folder === selectedFolder);

  // Get active folder display name
  const activeFolderName =
    selectedFolder === "all"
      ? "All Photos"
      : folders.find((f) => f.slug === selectedFolder)?.name || "Album";

  // Lightbox navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;

      if (e.key === "Escape") setSelectedPhotoIndex(null);
      if (e.key === "ArrowRight") {
        setSelectedPhotoIndex((prev) =>
          prev !== null && prev < filteredPhotos.length - 1 ? prev + 1 : prev
        );
      }
      if (e.key === "ArrowLeft") {
        setSelectedPhotoIndex((prev) =>
          prev !== null && prev > 0 ? prev - 1 : prev
        );
      }
    },
    [selectedPhotoIndex, filteredPhotos.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    if (selectedPhotoIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [handleKeyDown, selectedPhotoIndex]);

  // Handle touch swipe in lightbox for mobile phones
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && selectedPhotoIndex !== null && selectedPhotoIndex < filteredPhotos.length - 1) {
      setSelectedPhotoIndex((prev) => (prev !== null ? prev + 1 : null));
    }
    if (isRightSwipe && selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex((prev) => (prev !== null ? prev - 1 : null));
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Helper to get matching tab icon
  const getTabIcon = (slug: string) => {
    if (slug === "all") {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="7" x="3" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="14" rx="1" />
          <rect width="7" height="7" x="3" y="14" rx="1" />
        </svg>
      );
    }
    if (slug.includes("annual")) {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    }
    if (slug.includes("election") || slug.includes("captain")) {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
          <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      );
    }
    if (slug.includes("shiv") || slug.includes("jayanti")) {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
      </svg>
    );
  };

  const selectedPhoto =
    selectedPhotoIndex !== null ? filteredPhotos[selectedPhotoIndex] : null;

  return (
    <>
      {/* ─── Sticky Tab Bar for Mobile & Desktop ─── */}
      <section className="sticky top-16 md:top-20 z-30 bg-cream/95 backdrop-blur-md border-y border-ink/5 shadow-xs transition-all">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3">
          <div
            ref={tabContainerRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1"
          >
            {/* "All Photos" Tab */}
            <button
              onClick={() => setSelectedFolder("all")}
              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95 ${
                selectedFolder === "all"
                  ? "gradient-meadow text-white shadow-md shadow-meadow/25 ring-2 ring-meadow/30 scale-[1.02]"
                  : "bg-white text-ink/75 hover:text-ink hover:bg-cream-dark border border-ink/10"
              }`}
            >
              {getTabIcon("all")}
              <span>All Photos</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  selectedFolder === "all"
                    ? "bg-white/20 text-white"
                    : "bg-ink/5 text-ink/60"
                }`}
              >
                {photos.length}
              </span>
            </button>

            {/* Event Specific Tabs */}
            {folders.map((folder) => {
              const count = folderCounts[folder.slug] ?? 0;
              const isActive = selectedFolder === folder.slug;

              return (
                <button
                  key={folder.slug}
                  onClick={() => setSelectedFolder(folder.slug)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95 ${
                    isActive
                      ? "gradient-meadow text-white shadow-md shadow-meadow/25 ring-2 ring-meadow/30 scale-[1.02]"
                      : "bg-white text-ink/75 hover:text-ink hover:bg-cream-dark border border-ink/10"
                  }`}
                >
                  {getTabIcon(folder.slug)}
                  <span>{folder.name}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-ink/5 text-ink/60"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Gallery Content ─── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Album Meta & Count */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8 pb-4 border-b border-ink/5">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-meadow animate-pulse" />
            <h2 className="font-display font-semibold text-ink text-lg sm:text-xl">
              {activeFolderName}
            </h2>
            <span className="text-xs sm:text-sm font-medium text-ink/50 bg-white border border-ink/10 px-2.5 py-0.5 rounded-full">
              {filteredPhotos.length} photo{filteredPhotos.length !== 1 ? "s" : ""}
            </span>
          </div>

          {selectedFolder !== "all" && (
            <button
              onClick={() => setSelectedFolder("all")}
              className="text-xs sm:text-sm font-medium text-meadow hover:text-meadow-dark flex items-center gap-1 transition-colors"
            >
              View all albums
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>

        {/* Photos Grid or Empty State */}
        {filteredPhotos.length > 0 ? (
          <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4 md:gap-6 space-y-3 sm:space-y-4 md:space-y-6">
            {filteredPhotos.map((photo, index) => (
              <div
                key={photo.publicId || photo.id}
                className="break-inside-avoid relative group rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300 bg-gray-100"
                onClick={() => setSelectedPhotoIndex(index)}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  priority={index < 4}
                  loading={index < 4 ? "eager" : "lazy"}
                />

                {/* Bottom badge for event on mobile / hover overlay on desktop */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3 sm:p-4">
                  <div className="flex items-center justify-between text-white">
                    <span className="text-xs sm:text-sm font-medium truncate drop-shadow-sm">
                      {photo.folderName}
                    </span>
                    <span className="p-1.5 rounded-full bg-white/25 backdrop-blur-md">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 3 21 3 21 9" />
                        <polyline points="9 21 3 21 3 15" />
                        <line x1="21" y1="3" x2="14" y2="10" />
                        <line x1="3" y1="21" x2="10" y2="14" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Friendly Empty State */
          <div className="max-w-md mx-auto text-center py-16 sm:py-24 px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-meadow-light/50 border border-meadow-light flex items-center justify-center mx-auto mb-4 text-meadow">
              {getTabIcon(selectedFolder)}
            </div>
            <h3 className="font-display text-xl font-semibold text-ink mb-2">
              No photos in {activeFolderName} yet
            </h3>
            <p className="text-ink/60 text-sm mb-6 leading-relaxed">
              Our team is curating moments from this event. New photos will be uploaded soon to this album.
            </p>
            <button
              onClick={() => setSelectedFolder("all")}
              className="inline-flex items-center gap-2 py-2.5 px-5 rounded-full text-sm font-semibold text-white gradient-meadow hover:opacity-90 shadow-sm transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
              View All Photos ({photos.length})
            </button>
          </div>
        )}

        {/* Footer info note */}
        <div className="mt-16 sm:mt-24 text-center">
          <div className="inline-block p-1 rounded-full bg-meadow-light/50 border border-meadow-light mb-3">
            <span className="px-4 py-1 text-xs sm:text-sm text-meadow font-semibold">
              Deoraoji Itankar Public School
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink/60">
            More memories are added regularly from academic & cultural events.
          </p>
        </div>
      </section>

      {/* ─── Lightbox Modal ─── */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 backdrop-blur-md p-3 sm:p-6 transition-opacity duration-200"
          onClick={() => setSelectedPhotoIndex(null)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Header Controls */}
          <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center z-10 text-white">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-medium bg-white/10 border border-white/15 px-3 py-1 rounded-full backdrop-blur-md">
                {selectedPhoto.folderName}
              </span>
              <span className="text-xs sm:text-sm text-white/60 font-medium">
                {selectedPhotoIndex! + 1} / {filteredPhotos.length}
              </span>
            </div>

            <button
              className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 sm:p-2.5 backdrop-blur-md transition-all active:scale-95"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhotoIndex(null);
              }}
              title="Close (Esc)"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Desktop Previous Button */}
          {selectedPhotoIndex! > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/40 hover:bg-black/70 rounded-full p-3.5 backdrop-blur-md transition-all z-10 hidden sm:block active:scale-90"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhotoIndex(selectedPhotoIndex! - 1);
              }}
              title="Previous (Left Arrow)"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          {/* Image Container */}
          <div
            className="relative w-full max-w-5xl max-h-[80vh] sm:max-h-[85vh] flex items-center justify-center animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedPhoto.fullSrc || selectedPhoto.src}
              alt={selectedPhoto.alt}
              className="max-w-full max-h-[75vh] sm:max-h-[85vh] object-contain rounded-lg shadow-2xl select-none"
            />
          </div>

          {/* Desktop Next Button */}
          {selectedPhotoIndex! < filteredPhotos.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/40 hover:bg-black/70 rounded-full p-3.5 backdrop-blur-md transition-all z-10 hidden sm:block active:scale-90"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhotoIndex(selectedPhotoIndex! + 1);
              }}
              title="Next (Right Arrow)"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}

          {/* Mobile Bottom Thumb Navigation */}
          <div className="absolute bottom-4 left-0 right-0 flex sm:hidden justify-center items-center gap-4 z-10 px-4">
            <button
              disabled={selectedPhotoIndex! === 0}
              onClick={(e) => {
                e.stopPropagation();
                if (selectedPhotoIndex! > 0) setSelectedPhotoIndex(selectedPhotoIndex! - 1);
              }}
              className="px-4 py-2 rounded-full bg-white/15 text-white disabled:opacity-30 disabled:pointer-events-none backdrop-blur-md font-medium text-sm flex items-center gap-1.5 active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Prev
            </button>

            <span className="text-xs text-white/70 font-medium">
              Swipe or tap
            </span>

            <button
              disabled={selectedPhotoIndex! === filteredPhotos.length - 1}
              onClick={(e) => {
                e.stopPropagation();
                if (selectedPhotoIndex! < filteredPhotos.length - 1) {
                  setSelectedPhotoIndex(selectedPhotoIndex! + 1);
                }
              }}
              className="px-4 py-2 rounded-full bg-white/15 text-white disabled:opacity-30 disabled:pointer-events-none backdrop-blur-md font-medium text-sm flex items-center gap-1.5 active:scale-95"
            >
              Next
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
