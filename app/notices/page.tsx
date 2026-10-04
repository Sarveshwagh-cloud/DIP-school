"use client";

import { useEffect, useState, useMemo } from "react";
import PageHero from "@/components/PageHero";

type Notice = {
  public_id: string;
  url: string;
  title: string;
  created_at: string;
  format: string;
  bytes: number;
};

function formatBytes(b: number) {
  if (!b) return "";
  if (b < 1024) return b + " B";
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + " KB";
  return (b / (1024 * 1024)).toFixed(1) + " MB";
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "pdf" | "image">("all");

  useEffect(() => {
    fetch("/api/notices")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data) => {
        setNotices(data.notices || []);
      })
      .catch((err) => {
        console.error("Error fetching notices:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredNotices = useMemo(() => {
    return notices.filter((n) => {
      const matchSearch =
        !search.trim() ||
        n.title.toLowerCase().includes(search.toLowerCase().trim());
      const isPdf = n.format?.toLowerCase() === "pdf" || n.url?.toLowerCase().endsWith(".pdf");
      const matchType =
        typeFilter === "all" ||
        (typeFilter === "pdf" && isPdf) ||
        (typeFilter === "image" && !isPdf);
      return matchSearch && matchType;
    });
  }, [notices, search, typeFilter]);

  return (
    <>
      <PageHero
        eyebrow="Announcements & Circulars"
        title="School Notice Board"
        subtitle="Stay updated with official notifications, holiday schedules, examination notices, and event circulars from Deoraoji Itankar Public School."
      />

      <section className="max-w-5xl mx-auto px-5 py-12">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-ink/10 shadow-xs mb-8 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <svg
              className="w-4 h-4 text-ink/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search notices by keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-ink/15 focus:border-sky focus:ring-2 focus:ring-sky/20 outline-none text-ink text-sm bg-white"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setTypeFilter("all")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                typeFilter === "all"
                  ? "bg-sky text-white shadow-xs"
                  : "bg-cream text-ink/70 hover:bg-ink/5"
              }`}
            >
              All Notices ({notices.length})
            </button>
            <button
              onClick={() => setTypeFilter("pdf")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                typeFilter === "pdf"
                  ? "bg-sky text-white shadow-xs"
                  : "bg-cream text-ink/70 hover:bg-ink/5"
              }`}
            >
              PDF Circulars
            </button>
            <button
              onClick={() => setTypeFilter("image")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                typeFilter === "image"
                  ? "bg-sky text-white shadow-xs"
                  : "bg-cream text-ink/70 hover:bg-ink/5"
              }`}
            >
              Images
            </button>
          </div>
        </div>

        {/* Notices Content */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-ink/10 shadow-xs animate-pulse flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-ink/5" />
                  <div className="space-y-2">
                    <div className="w-48 h-4 rounded bg-ink/10" />
                    <div className="w-32 h-3 rounded bg-ink/5" />
                  </div>
                </div>
                <div className="w-20 h-8 rounded-lg bg-ink/5" />
              </div>
            ))}
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-ink/10 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-sky-light flex items-center justify-center mx-auto mb-4 text-sky">
              <svg
                className="w-8 h-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                <line x1="8" y1="13" x2="16" y2="13" />
                <line x1="8" y1="17" x2="12" y2="17" />
              </svg>
            </div>
            <h3 className="font-display font-semibold text-ink text-lg">
              {search ? "No matching notices found" : "No notices currently posted"}
            </h3>
            <p className="text-ink/50 text-sm mt-1 max-w-sm mx-auto">
              {search
                ? `No announcements match "${search}". Try searching with a different term.`
                : "Official notices and circulars will be published here as soon as they are announced."}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-sky bg-sky-light hover:brightness-95 transition"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotices.map((n) => {
              const isPdf =
                n.format?.toLowerCase() === "pdf" ||
                n.url?.toLowerCase().endsWith(".pdf");
              return (
                <div
                  key={n.public_id}
                  className="group bg-white rounded-2xl p-4 sm:p-5 border border-ink/10 shadow-xs hover:shadow-md hover:border-sky/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                        isPdf
                          ? "bg-blossom-light text-blossom"
                          : "bg-sky-light text-sky"
                      }`}
                    >
                      {isPdf ? "PDF" : "IMG"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink text-base group-hover:text-sky transition-colors">
                        {n.title}
                      </h3>
                      <div className="flex items-center gap-2.5 mt-1 text-xs text-ink/45">
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-3.5 h-3.5 text-ink/30"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          {formatDate(n.created_at)}
                        </span>
                        {n.bytes ? (
                          <>
                            <span>·</span>
                            <span>{formatBytes(n.bytes)}</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <a
                      href={n.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky hover:bg-sky/90 shadow-sm transition active:scale-95"
                    >
                      <span>View Notice</span>
                      <svg
                        className="w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Office Contact Info */}
        <div className="mt-12 bg-sky-light/60 rounded-3xl p-6 sm:p-8 border border-sky/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-display font-bold text-ink text-base">
              Need assistance regarding any circular or announcement?
            </h4>
            <p className="text-xs sm:text-sm text-ink/65">
              Contact the administrative office during school working hours (8:00 AM – 3:30 PM).
            </p>
          </div>
          <a
            href="tel:9822727300"
            className="inline-flex items-center gap-2 bg-ink text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full hover:bg-ink/90 transition shadow-sm shrink-0"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Call 98227 27300
          </a>
        </div>
      </section>
    </>
  );
}
