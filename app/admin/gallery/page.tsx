"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

type CloudinaryImage = {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  created_at: string;
  bytes: number;
  folder: string;
  folderName: string;
};

type FolderItem = {
  slug: string;
  name: string;
  count: number;
};

export default function GalleryAdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [selectedUploadFolder, setSelectedUploadFolder] = useState<string>("annual-day-2026");
  const [filterFolder, setFilterFolder] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // New folder creation state
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [showCloudinaryGuide, setShowCloudinaryGuide] = useState(false);

  // Fetch images from Cloudinary
  const fetchImages = useCallback(async (currentPassword = password) => {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery/images", {
        headers: { "x-admin-password": currentPassword },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setImages(data.images || []);
    } catch {
      showMessage("error", "Failed to load photos.");
    } finally {
      setLoading(false);
    }
  }, [password]);

  // Fetch folders from Cloudinary
  const fetchFolders = useCallback(async () => {
    try {
      const res = await fetch("/api/gallery/folders");
      if (res.ok) {
        const data = await res.json();
        setFolders(data.folders || []);
      }
    } catch (e) {
      console.error("Failed to load folders", e);
    }
  }, []);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/gallery/images", {
        headers: { "x-admin-password": password },
      });
      if (res.ok) {
        setIsAuthenticated(true);
        const data = await res.json();
        setImages(data.images || []);
        fetchFolders();
      } else {
        setAuthError("Incorrect password. Please try again.");
      }
    } catch {
      setAuthError("Connection error. Please try again.");
    }
  };

  // Show toast message
  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  // Create new folder in Cloudinary
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newFolderName.trim();
    if (!trimmed) return;

    setCreatingFolder(true);
    try {
      const res = await fetch("/api/gallery/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ folderName: trimmed }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create folder");

      showMessage("success", `Created folder: "${data.folder.name}"`);
      setNewFolderName("");
      setShowNewFolderModal(false);

      // Reload folders and auto-select the new folder
      await fetchFolders();
      setSelectedUploadFolder(data.folder.slug);
      setFilterFolder(data.folder.slug);
    } catch (err) {
      showMessage("error", (err as Error).message || "Failed to create folder");
    } finally {
      setCreatingFolder(false);
    }
  };

  // Handle file upload to the selected folder
  const handleUpload = async (files: FileList) => {
    if (files.length === 0) return;
    setUploading(true);
    setUploadProgress(0);

    const total = files.length;
    let completed = 0;
    let failed = 0;
    const targetFolder = `dips-gallery/${selectedUploadFolder}`;
    const targetFolderName =
      folders.find((f) => f.slug === selectedUploadFolder)?.name || selectedUploadFolder;

    for (const file of Array.from(files)) {
      try {
        // 1. Get upload signature from our API
        const timestamp = Math.round(Date.now() / 1000).toString();
        const paramsToSign = {
          timestamp,
          folder: targetFolder,
        };

        const signRes = await fetch("/api/gallery/sign", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": password,
          },
          body: JSON.stringify({ paramsToSign }),
        });

        if (!signRes.ok) throw new Error("Signing failed");
        const { signature } = await signRes.json();

        // 2. Upload directly to Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("folder", targetFolder);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: formData }
        );

        if (!uploadRes.ok) throw new Error("Upload failed");

        completed++;
        setUploadProgress(Math.round((completed / total) * 100));
      } catch {
        failed++;
        completed++;
        setUploadProgress(Math.round((completed / total) * 100));
      }
    }

    setUploading(false);
    setUploadProgress(0);

    if (failed > 0) {
      showMessage(
        "error",
        `Uploaded ${total - failed} of ${total} photos. ${failed} failed.`
      );
    } else {
      showMessage(
        "success",
        `Successfully uploaded ${total} photo${total > 1 ? "s" : ""} to "${targetFolderName}"!`
      );
    }

    // Refresh image & folder lists
    await fetchImages();
    await fetchFolders();
  };

  // Handle delete
  const handleDelete = async (publicId: string) => {
    if (!confirm("Are you sure you want to delete this photo from Cloudinary?")) return;

    setDeletingIds((prev) => new Set(prev).add(publicId));
    try {
      const res = await fetch("/api/gallery/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ publicId }),
      });

      if (!res.ok) throw new Error("Delete failed");

      setImages((prev) => prev.filter((img) => img.public_id !== publicId));
      showMessage("success", "Photo deleted from Cloudinary.");
      fetchFolders();
    } catch {
      showMessage("error", "Failed to delete photo.");
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(publicId);
        return next;
      });
    }
  };

  // Drag & drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Filter images for viewing
  const displayedImages =
    filterFolder === "all"
      ? images
      : images.filter((img) => img.folder === filterFolder);

  // Active target folder object
  const activeUploadFolderObj = folders.find((f) => f.slug === selectedUploadFolder);

  // ─── Login Screen ───
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-4">
        <div className="w-full max-w-md">
          <div className="pro-card p-8 md:p-10 shadow-xl bg-white rounded-2xl border border-ink/10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl gradient-meadow flex items-center justify-center mx-auto mb-4 shadow-md shadow-meadow/20">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              </div>
              <h1 className="font-display text-2xl font-bold text-ink">DIPS Gallery Admin</h1>
              <p className="text-ink/60 mt-2 text-sm leading-relaxed">
                Enter your admin password to upload and organize school photos into albums.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="lbl block text-sm font-semibold text-ink mb-1" htmlFor="admin-password">
                  Admin Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  className="fld w-full px-4 py-3 rounded-xl border border-ink/15 focus:border-meadow focus:ring-2 focus:ring-meadow/20 outline-none text-ink text-sm bg-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  autoFocus
                />
              </div>

              {authError && (
                <p className="text-blossom text-sm flex items-center gap-1.5 font-medium">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {authError}
                </p>
              )}

              <button
                type="submit"
                className="w-full mt-2 py-3 px-6 rounded-xl font-semibold text-white gradient-meadow hover:opacity-90 shadow-md shadow-meadow/20 transition-all active:scale-[0.99]"
              >
                Access Admin Panel
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ─── Admin Panel Main ───
  return (
    <div className="min-h-screen bg-cream">
      {/* Header Bar */}
      <header className="bg-white border-b border-ink/10 sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-meadow flex items-center justify-center shadow-xs">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </div>
            <div>
              <h1 className="font-display font-bold text-ink text-base sm:text-lg leading-tight">
                Gallery Manager
              </h1>
              <p className="text-xs text-ink/50">
                {images.length} photos • {folders.length} event albums
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setShowCloudinaryGuide(true)}
              className="text-xs font-semibold text-ink/70 hover:text-ink bg-ink/5 hover:bg-ink/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span className="hidden sm:inline">How Folders Work</span>
            </button>

            <a
              href="/gallery"
              target="_blank"
              rel="noreferrer"
              className="text-xs sm:text-sm font-semibold text-meadow hover:text-meadow-dark flex items-center gap-1 transition-colors px-2.5 py-1.5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <span className="hidden sm:inline">View Live</span> Gallery
            </a>

            <button
              onClick={() => {
                setIsAuthenticated(false);
                setPassword("");
              }}
              className="text-xs sm:text-sm text-ink/50 hover:text-blossom font-medium transition-colors px-2 py-1.5"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* ─── Step 1: Album Selection & Folder Creator ─── */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-ink/10 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ink/5">
            <div>
              <span className="text-xs font-semibold text-meadow uppercase tracking-wider">Step 1</span>
              <h2 className="font-display font-semibold text-ink text-base sm:text-lg">
                Select or Create Event Album
              </h2>
              <p className="text-xs text-ink/60 mt-0.5">
                Choose the folder where uploaded photos will go, or create a brand new event album.
              </p>
            </div>

            <button
              onClick={() => setShowNewFolderModal(true)}
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-meadow bg-meadow-light/50 border border-meadow/20 hover:bg-meadow-light transition-all active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              + Create New Event Album
            </button>
          </div>

          {/* Folder Pills for Upload Destination */}
          <div className="mt-4">
            <label className="text-xs font-semibold text-ink/70 mb-2 block">
              Active Upload Destination:
            </label>
            <div className="flex flex-wrap gap-2">
              {folders.map((folder) => {
                const isSelected = selectedUploadFolder === folder.slug;
                return (
                  <button
                    key={folder.slug}
                    type="button"
                    onClick={() => setSelectedUploadFolder(folder.slug)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      isSelected
                        ? "gradient-meadow text-white shadow-sm ring-2 ring-meadow/30 scale-[1.02]"
                        : "bg-cream hover:bg-cream-dark text-ink/70 border border-ink/10"
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                    </svg>
                    <span>{folder.name}</span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                        isSelected ? "bg-white/20 text-white" : "bg-ink/5 text-ink/60"
                      }`}
                    >
                      {images.filter((img) => img.folder === folder.slug).length}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-ink/50 mt-2.5">
              Cloudinary Destination: <code className="bg-cream-dark px-1.5 py-0.5 rounded text-ink/80">dips-gallery/{selectedUploadFolder}</code>
            </p>
          </div>
        </div>

        {/* ─── Step 2: Upload Zone ─── */}
        <div
          className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center transition-all duration-200 ${
            dragActive
              ? "border-meadow bg-meadow-light/40 scale-[1.01]"
              : "border-ink/15 hover:border-meadow/50 bg-white"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {uploading ? (
            <div className="space-y-4 py-4">
              <div className="w-14 h-14 rounded-full border-4 border-meadow-light border-t-meadow animate-spin mx-auto" />
              <div>
                <p className="font-semibold text-ink text-base">Uploading to {activeUploadFolderObj?.name || selectedUploadFolder}...</p>
                <p className="text-xs text-ink/50 mt-1">{uploadProgress}% complete</p>
              </div>
              <div className="w-64 max-w-full mx-auto h-2 bg-meadow-light rounded-full overflow-hidden">
                <div
                  className="h-full gradient-meadow rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-meadow-light flex items-center justify-center mx-auto mb-3 text-meadow">
                <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p className="font-semibold text-ink text-base sm:text-lg mb-1">
                {dragActive ? "Drop your photos now!" : `Upload to "${activeUploadFolderObj?.name || selectedUploadFolder}"`}
              </p>
              <p className="text-ink/50 text-xs sm:text-sm mb-5 max-w-md mx-auto">
                Drag & drop photos here, or click below to browse from your device
              </p>
              <label className="inline-flex items-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm text-white gradient-meadow hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-meadow/20 active:scale-95">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Choose Photos to Upload
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && handleUpload(e.target.files)}
                />
              </label>
              <p className="text-ink/40 text-xs mt-3">Supports JPG, PNG, WebP • Batch upload allowed</p>
            </>
          )}
        </div>

        {/* ─── Step 3: Manage Uploaded Photos ─── */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display font-semibold text-ink text-lg">
                Manage Photos ({displayedImages.length})
              </h2>
              <p className="text-xs text-ink/50">
                Filter and view photos by album, or delete photos that are no longer needed.
              </p>
            </div>

            {/* Filter by Album */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <button
                type="button"
                onClick={() => setFilterFolder("all")}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterFolder === "all"
                    ? "bg-ink text-white"
                    : "bg-white text-ink/70 border border-ink/10 hover:bg-cream"
                }`}
              >
                All ({images.length})
              </button>
              {folders.map((f) => {
                const count = images.filter((img) => img.folder === f.slug).length;
                return (
                  <button
                    key={f.slug}
                    type="button"
                    onClick={() => setFilterFolder(f.slug)}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      filterFolder === f.slug
                        ? "bg-ink text-white"
                        : "bg-white text-ink/70 border border-ink/10 hover:bg-cream"
                    }`}
                  >
                    {f.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photo Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20 bg-white rounded-2xl border border-ink/5">
              <div className="w-10 h-10 rounded-full border-4 border-meadow-light border-t-meadow animate-spin" />
            </div>
          ) : displayedImages.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-ink/10">
              <div className="w-14 h-14 rounded-2xl bg-cream-dark flex items-center justify-center mx-auto mb-3 text-ink/40">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              </div>
              <p className="font-semibold text-ink text-base">No photos found in this album</p>
              <p className="text-ink/50 text-xs mt-1">Select this album above and upload some photos!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {displayedImages.map((img) => (
                <div
                  key={img.public_id}
                  className={`group relative rounded-xl overflow-hidden bg-gray-100 aspect-square shadow-xs transition-all duration-200 ${
                    deletingIds.has(img.public_id) ? "opacity-30 scale-95" : ""
                  }`}
                >
                  <Image
                    src={img.secure_url}
                    alt={img.public_id.split("/").pop() || "Gallery photo"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />

                  {/* Album Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <span className="text-[10px] font-semibold bg-black/60 text-white px-2 py-0.5 rounded-md backdrop-blur-md">
                      {img.folderName}
                    </span>
                  </div>

                  {/* Hover Overlay with Delete */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 text-[11px] font-medium">
                        {formatBytes(img.bytes)}
                      </span>
                      <button
                        onClick={() => handleDelete(img.public_id)}
                        disabled={deletingIds.has(img.public_id)}
                        className="bg-blossom hover:bg-blossom-dark text-white p-2 rounded-lg transition-colors active:scale-90"
                        title="Delete photo from Cloudinary"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ─── Modal: Create New Event Album ─── */}
      {showNewFolderModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-xs p-4"
          onClick={() => setShowNewFolderModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-ink/10 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-ink text-lg">
                Create New Event Album
              </h3>
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="text-ink/40 hover:text-ink p-1 rounded-lg"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <p className="text-ink/60 text-xs sm:text-sm mb-5 leading-relaxed">
              Enter the event name (e.g. <strong>Shiv Jayanti 2026</strong>, <strong>School Captain Election</strong>, or <strong>Science Exhibition</strong>). It will create a separate folder in Cloudinary and add a tab to the public gallery.
            </p>

            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-ink block mb-1.5" htmlFor="folder-name-input">
                  Event / Album Title
                </label>
                <input
                  id="folder-name-input"
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-ink/15 focus:border-meadow focus:ring-2 focus:ring-meadow/20 outline-none text-ink text-sm"
                  placeholder="e.g. Sports Day 2026"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  autoFocus
                />
              </div>

              {newFolderName.trim() && (
                <div className="p-3 bg-cream rounded-xl text-xs text-ink/70">
                  <span>Cloudinary folder path: </span>
                  <code className="text-meadow font-semibold">
                    dips-gallery/
                    {newFolderName
                      .trim()
                      .toLowerCase()
                      .replace(/[^a-z0-9-_]/g, "-")
                      .replace(/-+/g, "-")}
                  </code>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-ink/15 text-ink/70 font-semibold text-sm hover:bg-cream transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newFolderName.trim() || creatingFolder}
                  className="flex-1 py-2.5 px-4 rounded-xl text-white font-semibold text-sm gradient-meadow hover:opacity-90 disabled:opacity-50 transition-all shadow-sm"
                >
                  {creatingFolder ? "Creating..." : "Create Album"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal: How Cloudinary Folders Work Guide ─── */}
      {showCloudinaryGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-xs p-4"
          onClick={() => setShowCloudinaryGuide(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-ink/10 animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-ink text-lg">
                How Cloudinary Folders & Gallery Work
              </h3>
              <button
                onClick={() => setShowCloudinaryGuide(false)}
                className="text-ink/40 hover:text-ink p-1 rounded-lg"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-ink/80 leading-relaxed">
              <div className="p-3.5 bg-meadow-light/50 border border-meadow-light rounded-xl text-ink">
                <p className="font-semibold text-meadow mb-1">
                  1. Automatic Admin Setup (Recommended)
                </p>
                <p className="text-xs text-ink/70">
                  Staff does <strong>not</strong> need to log in to Cloudinary! You can create any folder right here by clicking <strong>&quot;+ Create New Event Album&quot;</strong>. The system will create the folder in Cloudinary and immediately add a tab to the public gallery.
                </p>
              </div>

              <div className="p-3.5 bg-cream rounded-xl text-ink border border-ink/10">
                <p className="font-semibold text-ink mb-1">
                  2. Cloudinary Folder Structure
                </p>
                <p className="text-xs text-ink/70 mb-2">
                  All photos live inside <code className="bg-white px-1.5 py-0.5 rounded border border-ink/10 font-semibold">dips-gallery/</code> with subfolders for each event:
                </p>
                <ul className="text-xs text-ink/70 list-disc list-inside space-y-1 font-mono">
                  <li>dips-gallery/annual-day-2026/</li>
                  <li>dips-gallery/school-captain-election/</li>
                  <li>dips-gallery/shiv-jayanti-2026/</li>
                </ul>
              </div>

              <div className="p-3.5 bg-cream rounded-xl text-ink border border-ink/10">
                <p className="font-semibold text-ink mb-1">
                  3. If you want to create folders in Cloudinary Dashboard manually:
                </p>
                <ol className="text-xs text-ink/70 list-decimal list-inside space-y-1.5">
                  <li>Log in to your Cloudinary Console.</li>
                  <li>Click <strong>Media Library</strong> in the left sidebar.</li>
                  <li>Open the <strong>dips-gallery</strong> folder.</li>
                  <li>Click <strong>&quot;Add Folder&quot;</strong> and type the event slug (e.g. <code className="bg-white px-1 rounded">sports-day-2026</code>).</li>
                  <li>Any images uploaded there will automatically show under that tab on the website!</li>
                </ol>
              </div>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setShowCloudinaryGuide(false)}
                className="py-2.5 px-6 rounded-xl font-semibold text-sm text-white gradient-meadow hover:opacity-90"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Toast Message ─── */}
      {message && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-4 duration-200 ${
            message.type === "success" ? "bg-meadow" : "bg-blossom"
          }`}
        >
          {message.type === "success" ? (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
          {message.text}
        </div>
      )}
    </div>
  );
}
