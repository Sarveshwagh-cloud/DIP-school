"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

const SecureDocumentModal = dynamic(() => import("./SecureDocumentModal"), {
  ssr: false,
});

interface DocumentItem {
  title: string;
  filename: string;
}

interface DisclosureDocListProps {
  documents: [string, string][];
}

export default function DisclosureDocList({ documents }: DisclosureDocListProps) {
  const [activeDoc, setActiveDoc] = useState<DocumentItem | null>(null);

  const handleOpenDoc = (title: string, filename: string) => {
    setActiveDoc({ title, filename });
  };

  const handleCloseDoc = () => {
    setActiveDoc(null);
  };

  return (
    <>
      <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {documents.map(([title, filename]) => (
          <button
            key={filename}
            type="button"
            onClick={() => handleOpenDoc(title, filename)}
            className="group flex items-center justify-between gap-3 bg-white border-2 border-meadow/10 rounded-2xl p-4 hover:border-meadow/40 hover:shadow-sm text-left transition cursor-pointer"
          >
            <span className="font-semibold text-ink text-[15px] group-hover:text-meadow transition">
              {title}
            </span>
            <span className="shrink-0 flex items-center gap-1.5 text-meadow font-bold text-sm bg-meadow/10 group-hover:bg-meadow group-hover:text-white px-3 py-1.5 rounded-xl transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              View
            </span>
          </button>
        ))}
      </div>

      <p className="text-center text-sm text-ink/50 mt-6 flex items-center justify-center gap-1.5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-meadow/70 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span>Protected viewer: Documents open in a secure, read-only mode.</span>
      </p>

      {/* Secure Viewer Modal */}
      {activeDoc && (
        <SecureDocumentModal doc={activeDoc} onClose={handleCloseDoc} />
      )}
    </>
  );
}
