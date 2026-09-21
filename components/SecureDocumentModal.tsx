"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";

interface SecureDocumentModalProps {
  doc: {
    title: string;
    filename: string;
  } | null;
  onClose: () => void;
}

// Helper to dynamically load local PDF.js without bundler / SSR issues
function loadPdfJs(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject();
  if ((window as any).pdfjsLib) {
    return Promise.resolve((window as any).pdfjsLib);
  }
  return new Promise((resolve, reject) => {
    // Check if script element is already added
    const existingScript = document.querySelector('script[src="/pdfjs/pdf.min.js"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => {
        const lib = (window as any).pdfjsLib;
        if (lib) {
          lib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js";
          resolve(lib);
        }
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "/pdfjs/pdf.min.js";
    script.async = true;
    script.onload = () => {
      const lib = (window as any).pdfjsLib;
      if (lib) {
        lib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js";
        resolve(lib);
      } else {
        reject(new Error("pdfjsLib not found"));
      }
    };
    script.onerror = () => reject(new Error("Failed to load PDF viewer engine"));
    document.head.appendChild(script);
  });
}

// Single Page Canvas Renderer
function PdfPageCanvas({
  pdf,
  pageNumber,
  scale,
}: {
  pdf: any;
  pageNumber: number;
  scale: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<any>(null);

  useEffect(() => {
    let isCancelled = false;

    async function renderPage() {
      if (!pdf || !canvasRef.current) return;

      try {
        const page = await pdf.getPage(pageNumber);
        if (isCancelled) return;

        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch {
            // ignore
          }
          renderTaskRef.current = null;
        }

        const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2.5) : 1;
        const viewport = page.getViewport({ scale: scale * dpr });
        const displayViewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${displayViewport.width}px`;
        canvas.style.maxWidth = "100%";
        canvas.style.height = "auto";

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };

        const task = page.render(renderContext);
        renderTaskRef.current = task;
        await task.promise;
      } catch (err: any) {
        if (err?.name !== "RenderingCancelledException") {
          console.error("PDF page render error:", err);
        }
      }
    }

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // ignore
        }
      }
    };
  }, [pdf, pageNumber, scale]);

  return (
    <div className="relative my-2 sm:my-4 flex flex-col items-center select-none">
      <canvas
        ref={canvasRef}
        className="rounded-xl shadow-lg bg-white pointer-events-none block border border-slate-200"
      />
      <div className="text-[11px] sm:text-xs text-ink/50 mt-2 font-medium">
        Page {pageNumber} of {pdf.numPages}
      </div>
    </div>
  );
}

export default function SecureDocumentModal({ doc, onClose }: SecureDocumentModalProps) {
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1.2);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const showWarning = useCallback((msg: string) => {
    setWarningMessage(msg);
    const timer = setTimeout(() => setWarningMessage(null), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Set default scale based on screen width
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMobile = window.innerWidth < 640;
      setScale(isMobile ? 0.85 : 1.25);
    }
  }, []);

  // Load PDF data via PDF.js into canvas
  useEffect(() => {
    if (!doc) return;

    let isMounted = true;
    setIsLoading(true);
    setLoadError(null);
    setPdfDoc(null);

    loadPdfJs()
      .then((pdfjsLib) => {
        const loadingTask = pdfjsLib.getDocument({
          url: `/disclosure/${doc.filename}`,
          cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/",
          cMapPacked: true,
        });

        return loadingTask.promise;
      })
      .then((loadedPdf: any) => {
        if (isMounted) {
          setPdfDoc(loadedPdf);
          setIsLoading(false);
        }
      })
      .catch((err: any) => {
        if (isMounted) {
          console.error("Failed to load PDF:", err);
          setLoadError("Unable to load document. Please try again.");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [doc]);

  // Security restrictions (keyboard, blur, contextmenu)
  useEffect(() => {
    if (!doc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
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

    const handleBlur = () => {
      setIsWindowBlurred(true);
    };

    const handleFocus = () => {
      setIsWindowBlurred(false);
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showWarning("Context menu is disabled for protected documents.");
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("contextmenu", handleContextMenu);

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

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2.5));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleResetZoom = () => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    setScale(isMobile ? 0.85 : 1.25);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-sm p-1 sm:p-4 select-none print:hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={doc.title}
    >
      <div className="relative w-full max-w-5xl h-[96vh] sm:h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-meadow/20">
        {/* Header */}
        <div className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3 bg-cream border-b border-meadow/15">
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden pr-2">
            <span className="shrink-0 flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold bg-meadow/10 text-meadow border border-meadow/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3 sm:w-3.5 sm:h-3.5"
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
            <h3 className="font-semibold text-ink text-xs sm:text-sm md:text-base truncate" title={doc.title}>
              {doc.title}
            </h3>
          </div>

          {/* Controls: Zoom & Close */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <div className="hidden xs:flex items-center bg-ink/5 rounded-xl p-0.5 border border-ink/10">
              <button
                onClick={handleZoomOut}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-ink/10 text-ink/70 hover:text-ink transition text-sm font-bold"
                title="Zoom Out"
                aria-label="Zoom Out"
              >
                −
              </button>
              <button
                onClick={handleResetZoom}
                className="px-1.5 sm:px-2 text-[11px] font-semibold text-ink/70 hover:text-ink"
                title="Reset Zoom"
              >
                {Math.round(scale * 100)}%
              </button>
              <button
                onClick={handleZoomIn}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-ink/10 text-ink/70 hover:text-ink transition text-sm font-bold"
                title="Zoom In"
                aria-label="Zoom In"
              >
                +
              </button>
            </div>

            <button
              onClick={onClose}
              className="shrink-0 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-ink/5 hover:bg-ink/10 text-ink/70 hover:text-ink transition focus:outline-none focus:ring-2 focus:ring-meadow cursor-pointer"
              aria-label="Close document viewer"
              title="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 sm:w-5 sm:h-5"
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
        </div>

        {/* Viewer Body with Native Momentum Touch Scrolling */}
        <div
          ref={containerRef}
          className="relative flex-1 w-full h-full bg-slate-100 overflow-y-auto p-2 sm:p-4 touch-pan-y"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/90 z-20">
              <div className="w-9 h-9 border-3 border-meadow border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm font-semibold text-ink/70">Opening document safely...</p>
            </div>
          )}

          {/* Load Error State */}
          {loadError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20">
              <div className="w-12 h-12 rounded-full bg-blossom-light text-blossom flex items-center justify-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <p className="text-ink font-semibold mb-2">{loadError}</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-meadow text-white text-xs font-semibold rounded-xl"
              >
                Close Viewer
              </button>
            </div>
          )}

          {/* Render All Pages as Protected Canvases */}
          {pdfDoc && (
            <div className="flex flex-col items-center min-w-full pb-4">
              {Array.from({ length: pdfDoc.numPages }, (_, i) => (
                <PdfPageCanvas
                  key={i + 1}
                  pdf={pdfDoc}
                  pageNumber={i + 1}
                  scale={scale}
                />
              ))}
            </div>
          )}

          {/* Privacy Protection Shield when Window Loses Focus / Snipping Tool Activated */}
          {isWindowBlurred && (
            <div
              className="absolute inset-0 z-30 bg-ink/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white cursor-pointer"
              onClick={() => setIsWindowBlurred(false)}
            >
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
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
              <h4 className="font-bold text-base sm:text-lg mb-1">Viewing Paused</h4>
              <p className="text-white/70 text-xs sm:text-sm max-w-sm mb-4">
                Document display is paused while the window is inactive or screen capture is detected.
              </p>
              <span className="px-4 py-2 rounded-xl bg-meadow text-white text-xs sm:text-sm font-semibold hover:bg-meadow-dark transition shadow">
                Tap to Resume Viewing
              </span>
            </div>
          )}

          {/* Toast Warning Notification */}
          {warningMessage && (
            <div className="fixed sm:absolute bottom-5 left-1/2 -translate-x-1/2 z-40 bg-ink text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs sm:text-sm font-medium border border-white/10 max-w-[90%] sm:max-w-md text-center">
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

        {/* Footer Info Banner */}
        <div className="px-3 sm:px-4 py-2 bg-cream border-t border-meadow/10 flex items-center justify-between text-[11px] sm:text-xs text-ink/60">
          <span className="truncate">Deoraoji Itankar Public School</span>
          <span className="shrink-0 ml-2 font-medium">Read-Only Protected</span>
        </div>
      </div>
    </div>
  );
}
