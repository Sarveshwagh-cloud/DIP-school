"use client";

import { useEffect, useState } from "react";

type DocItem = {
  public_id: string;
  url: string;
  title: string;
  created_at: string;
  format: string;
  bytes: number;
  category: string;
};

const CATEGORY_NAMES: Record<string, string> = {
  "mandatory-disclosure": "Mandatory Disclosures",
  "fee-structure": "Fee Structure",
  "academic-calendar": "Academic Calendar",
  "circular": "Circulars & Orders",
  "results": "Board & Academic Results",
  "other": "Other School Documents",
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

export default function UploadedSchoolDocs() {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/documents")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setDocs(data.documents || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-3 max-w-4xl mx-auto mt-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-16 rounded-2xl bg-meadow-light/50 animate-pulse" />
        ))}
      </div>
    );
  }

  if (docs.length === 0) {
    return null;
  }

  // Group by category
  const categories = Array.from(new Set(docs.map((d) => d.category)));

  return (
    <div className="mt-14 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <span className="eyebrow text-sun-ink">Direct School Updates</span>
        <h3 className="font-display font-semibold text-2xl text-ink mt-1">
          Recent Documents &amp; Circulars
        </h3>
        <p className="text-sm text-ink/60 mt-1">
          Latest official documents and notifications published directly by DIPS administration.
        </p>
      </div>

      <div className="space-y-8">
        {categories.map((cat) => {
          const catDocs = docs.filter((d) => d.category === cat);
          const catTitle = CATEGORY_NAMES[cat] || cat.replace(/[-_]+/g, " ");
          return (
            <div key={cat} className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-sun/20 shadow-xs">
              <h4 className="font-display font-bold text-ink text-lg mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sun" />
                {catTitle} ({catDocs.length})
              </h4>
              <div className="space-y-2.5">
                {catDocs.map((doc) => {
                  const isPdf = doc.format?.toLowerCase() === "pdf" || doc.url.toLowerCase().endsWith(".pdf");
                  return (
                    <div
                      key={doc.public_id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-cream border border-ink/5 hover:border-sun/40 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-[11px] ${
                            isPdf
                              ? "bg-blossom-light text-blossom"
                              : "bg-sun-light text-sun-ink"
                          }`}
                        >
                          {isPdf ? "PDF" : "IMG"}
                        </div>
                        <div>
                          <p className="font-semibold text-ink text-sm leading-snug">
                            {doc.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-ink/40 mt-0.5">
                            <span>{formatDate(doc.created_at)}</span>
                            {doc.bytes ? (
                              <>
                                <span>·</span>
                                <span>{formatBytes(doc.bytes)}</span>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold text-sun-ink bg-sun-light hover:bg-sun hover:text-ink transition self-end sm:self-center shrink-0"
                      >
                        <span>View</span>
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
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
