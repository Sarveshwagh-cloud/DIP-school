"use client";

import React, { useEffect, useState, useCallback } from "react";

interface SecureDocumentModalProps {
  doc: {
    title: string;
    filename: string;
  } | null;
  onClose: () => void;
}

export default function SecureDocumentModal({ doc, onClose }: SecureDocumentModalProps) {
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);

  const showWarning = useCallback((msg: string) => {
    setWarningMessage(msg);
    const timer = setTimeout(() => setWarningMessage(null), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Handle keyboard shortcuts and screenshot prevention
  useEffect(() => {
    if (!doc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Close on Escape
      if (e.key === "Escape") {
        onClose();
        return;
      }

      const key = e.key.toLowerCase();

      // Block Ctrl/Cmd + S (Save)
      if ((e.ctrlKey || e.metaKey) && key === "s") {
        e.preventDefault();
        showWarning("Downloading is disabled for protected documents.");
        return;
      }

      // Block Ctrl/Cmd + P (Print)
      if ((e.ctrlKey || e.metaKey) && key === "p") {
        e.preventDefault();
        showWarning("Printing is disabled for protected documents.");
        return;
      }

      // Block Ctrl/Cmd + U (View Source)
      if ((e.ctrlKey || e.metaKey) && key === "u") {
        e.preventDefault();
        return;
      }

      // Block PrintScreen key
      if (e.key === "PrintScreen") {
        e.preventDefault();
        try {
          navigator.clipboard?.writeText("");
        } catch {
          // ignore
        }
        showWarning("Screenshots are restricted for protected documents.");
      }
    };

    // Anti-screenshot / Snipping tool detection via window blur
    const handleBlur = () => {
      setIsWindowBlurred(true);
    };

    const handleFocus = () => {
      setIsWindowBlurred(false);
    };

    // Disable right click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showWarning("Right-click context menu is disabled.");
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("contextmenu", handleContextMenu);

    // Prevent body scroll while modal is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("contextmenu", handleContextMenu);
      document.body.style.overflow = "unset";
    };
  }, [doc, onClose, showWarning]);

  if (!doc) return null;

  const pdfUrl = `/disclosure/${doc.filename}#toolbar=0&navpanes=0&scrollbar=1`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm p-2 sm:p-4 select-none print:hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={doc.title}
    >
      <div className="relative w-full max-w-5xl h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-meadow/20">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-cream border-b border-meadow/15">
          <div className="flex items-center gap-3 overflow-hidden pr-2">
            <span className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-meadow/10 text-meadow border border-meadow/20">
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
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Protected View
            </span>
            <h3 className="font-semibold text-ink text-sm sm:text-base truncate" title={doc.title}>
              {doc.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-ink/5 hover:bg-ink/10 text-ink/70 hover:text-ink transition focus:outline-none focus:ring-2 focus:ring-meadow"
            aria-label="Close document viewer"
            title="Close (Esc)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Viewer Body */}
        <div className="relative flex-1 w-full h-full bg-slate-100 overflow-hidden">
          {/* Iframe with PDF - Native browser rendering for 0ms loading time & 0 errors */}
          <iframe
            src={pdfUrl}
            className="w-full h-full border-0 select-none"
            title={doc.title}
          />

          {/* Privacy protection shield when window loses focus (e.g. Snipping tool / Screen capture) */}
          {isWindowBlurred && (
            <div
              className="absolute inset-0 z-30 bg-ink/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white cursor-pointer"
              onClick={() => setIsWindowBlurred(false)}
            >
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-3 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7"
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
              </div>
              <h4 className="font-bold text-lg mb-1">Viewing Paused</h4>
              <p className="text-white/70 text-sm max-w-sm mb-4">
                Document display is paused while the window is inactive or screen capture is detected.
              </p>
              <span className="px-4 py-2 rounded-xl bg-meadow text-white text-sm font-semibold hover:bg-meadow-dark transition shadow">
                Click to Resume Viewing
              </span>
            </div>
          )}

          {/* Toast Warning Notification */}
          {warningMessage && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 bg-ink text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs sm:text-sm font-medium border border-white/10 animate-fade-in">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-sun shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>{warningMessage}</span>
            </div>
          )}
        </div>

        {/* Footer info banner */}
        <div className="px-4 py-2 bg-cream border-t border-meadow/10 flex items-center justify-between text-xs text-ink/60">
          <span>Deoraoji Itankar Public School • Mandatory Public Disclosure</span>
          <span className="hidden sm:inline">Read-only view • Downloading & printing disabled</span>
        </div>
      </div>
    </div>
  );
}
