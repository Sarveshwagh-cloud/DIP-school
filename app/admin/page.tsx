"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

// ─── Types ───────────────────────────────────────────────────────────
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

type Notice = {
  public_id: string;
  url: string;
  title: string;
  created_at: string;
  format: string;
  bytes: number;
};

type Tab = "gallery" | "notices" | "documents";

// ─── Shared Helpers ──────────────────────────────────────────────────
function formatBytes(b: number) {
  if (b < 1024) return b + " B";
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + " KB";
  return (b / (1024 * 1024)).toFixed(1) + " MB";
}

function slugify(s: string) {
  return s.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

// ─── Toast ───────────────────────────────────────────────────────────
function Toast({ msg }: { msg: { type: "success" | "error"; text: string } | null }) {
  if (!msg) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-4 duration-200 ${msg.type === "success" ? "bg-meadow" : "bg-blossom"}`}>
      {msg.type === "success" ? (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      ) : (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
      )}
      {msg.text}
    </div>
  );
}

// ─── Gallery Tab ─────────────────────────────────────────────────────
function GalleryTab({ password, showMsg }: { password: string; showMsg: (t: "success" | "error", s: string) => void }) {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [selectedUploadFolder, setSelectedUploadFolder] = useState("annual-day-2026");
  const [filterFolder, setFilterFolder] = useState("all");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery/images", { headers: { "x-admin-password": password } });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setImages(data.images || []);
    } catch { showMsg("error", "Failed to load photos."); }
    finally { setLoading(false); }
  }, [password, showMsg]);

  const fetchFolders = useCallback(async () => {
    try {
      const res = await fetch("/api/gallery/folders");
      if (res.ok) { const d = await res.json(); setFolders(d.folders || []); }
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchImages(); fetchFolders(); }, [fetchImages, fetchFolders]);

  const handleUpload = async (files: FileList) => {
    if (!files.length) return;
    setUploading(true); setUploadProgress(0);
    const total = files.length; let completed = 0; let failed = 0;
    const targetFolder = `dips-gallery/${selectedUploadFolder}`;

    for (const file of Array.from(files)) {
      try {
        const timestamp = Math.round(Date.now() / 1000).toString();
        const signRes = await fetch("/api/gallery/sign", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-admin-password": password },
          body: JSON.stringify({ paramsToSign: { timestamp, folder: targetFolder } }),
        });
        if (!signRes.ok) throw new Error();
        const { signature } = await signRes.json();
        const fd = new FormData();
        fd.append("file", file);
        fd.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
        fd.append("timestamp", timestamp);
        fd.append("signature", signature);
        fd.append("folder", targetFolder);
        const up = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: fd });
        if (!up.ok) throw new Error();
        completed++;
      } catch { failed++; completed++; }
      setUploadProgress(Math.round((completed / total) * 100));
    }

    setUploading(false); setUploadProgress(0);
    if (failed > 0) showMsg("error", `Uploaded ${total - failed}/${total} photos. ${failed} failed.`);
    else showMsg("success", `Uploaded ${total} photo${total > 1 ? "s" : ""}!`);
    await fetchImages(); await fetchFolders();
  };

  const handleDelete = async (publicId: string) => {
    if (!confirm("Delete this photo from Cloudinary?")) return;
    setDeletingIds(prev => new Set(prev).add(publicId));
    try {
      const res = await fetch("/api/gallery/delete", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-password": password }, body: JSON.stringify({ publicId }) });
      if (!res.ok) throw new Error();
      setImages(prev => prev.filter(img => img.public_id !== publicId));
      showMsg("success", "Photo deleted.");
      fetchFolders();
    } catch { showMsg("error", "Failed to delete photo."); }
    finally { setDeletingIds(prev => { const n = new Set(prev); n.delete(publicId); return n; }); }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    setCreatingFolder(true);
    try {
      const res = await fetch("/api/gallery/folders", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-password": password }, body: JSON.stringify({ folderName: newFolderName.trim() }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showMsg("success", `Created album: "${data.folder.name}"`);
      setNewFolderName(""); setShowNewFolderModal(false);
      await fetchFolders();
      setSelectedUploadFolder(data.folder.slug);
      setFilterFolder(data.folder.slug);
    } catch (err) { showMsg("error", (err as Error).message || "Failed to create album"); }
    finally { setCreatingFolder(false); }
  };

  const displayed = filterFolder === "all" ? images : images.filter(i => i.folder === filterFolder);

  return (
    <div className="space-y-6">
      {/* Album selector */}
      <div className="bg-white rounded-2xl p-5 border border-ink/10 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-ink/5">
          <div>
            <span className="text-xs font-semibold text-meadow uppercase tracking-wider">Step 1</span>
            <h2 className="font-display font-semibold text-ink text-base sm:text-lg">Select or Create Event Album</h2>
            <p className="text-xs text-ink/50 mt-0.5">Choose the folder photos will be uploaded to.</p>
          </div>
          <button onClick={() => setShowNewFolderModal(true)} className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-meadow bg-meadow-light/50 border border-meadow/20 hover:bg-meadow-light transition-all active:scale-95">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            New Event Album
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {folders.map(f => (
            <button key={f.slug} onClick={() => setSelectedUploadFolder(f.slug)} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${selectedUploadFolder === f.slug ? "gradient-meadow text-white shadow-sm" : "bg-cream text-ink/70 border border-ink/10"}`}>
              {f.name} <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${selectedUploadFolder === f.slug ? "bg-white/20 text-white" : "bg-ink/5 text-ink/50"}`}>{images.filter(i => i.folder === f.slug).length}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-ink/40 mt-2">Uploading to: <code className="bg-cream px-1 rounded">dips-gallery/{selectedUploadFolder}</code></p>
      </div>

      {/* Upload zone */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all ${dragActive ? "border-meadow bg-meadow-light/40 scale-[1.01]" : "border-ink/15 hover:border-meadow/50 bg-white"}`}
        onDragEnter={e => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files); }}
      >
        {uploading ? (
          <div className="space-y-4 py-4">
            <div className="w-12 h-12 rounded-full border-4 border-meadow-light border-t-meadow animate-spin mx-auto" />
            <p className="font-semibold text-ink">Uploading... {uploadProgress}%</p>
            <div className="w-64 max-w-full mx-auto h-2 bg-meadow-light rounded-full overflow-hidden">
              <div className="h-full gradient-meadow rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 rounded-2xl bg-meadow-light flex items-center justify-center mx-auto mb-3 text-meadow">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
            </div>
            <p className="font-semibold text-ink text-lg mb-1">{dragActive ? "Drop photos now!" : "Drag & drop photos here"}</p>
            <p className="text-ink/50 text-sm mb-5">or click to browse from your device · JPG, PNG, WebP</p>
            <label className="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl font-semibold text-sm text-white gradient-meadow hover:opacity-90 cursor-pointer shadow-md shadow-meadow/20 active:scale-95">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
              Choose Photos
              <input type="file" accept="image/*" multiple className="hidden" onChange={e => e.target.files && handleUpload(e.target.files)} />
            </label>
          </>
        )}
      </div>

      {/* Photo grid */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <h2 className="font-display font-semibold text-ink text-lg">Photos ({displayed.length})</h2>
          <div className="flex flex-wrap gap-1.5">
            {[{ slug: "all", name: "All", count: images.length }, ...folders.map(f => ({ ...f, count: images.filter(i => i.folder === f.slug).length }))].map(f => (
              <button key={f.slug} onClick={() => setFilterFolder(f.slug)} className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${filterFolder === f.slug ? "bg-ink text-white" : "bg-white text-ink/70 border border-ink/10 hover:bg-cream"}`}>
                {f.name} ({f.count})
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16 bg-white rounded-2xl border border-ink/5">
            <div className="w-10 h-10 rounded-full border-4 border-meadow-light border-t-meadow animate-spin" />
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-ink/10">
            <p className="text-ink/40 font-semibold">No photos in this album</p>
            <p className="text-ink/30 text-xs mt-1">Upload some photos above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {displayed.map(img => (
              <div key={img.public_id} className={`group relative rounded-xl overflow-hidden bg-gray-100 aspect-square shadow-xs transition-all ${deletingIds.has(img.public_id) ? "opacity-30 scale-95" : ""}`}>
                <Image src={img.secure_url} alt={img.public_id.split("/").pop() || "photo"} fill className="object-cover" sizes="(max-width:640px) 50vw, 20vw" />
                <span className="absolute top-1.5 left-1.5 text-[10px] font-semibold bg-black/60 text-white px-1.5 py-0.5 rounded backdrop-blur-sm">{img.folderName}</span>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-[10px]">{formatBytes(img.bytes)}</span>
                    <button onClick={() => handleDelete(img.public_id)} disabled={deletingIds.has(img.public_id)} className="bg-blossom text-white p-1.5 rounded-lg transition-colors active:scale-90" title="Delete">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-sm p-4" onClick={() => setShowNewFolderModal(false)}>
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-ink/10" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-ink text-lg">Create New Event Album</h3>
              <button onClick={() => setShowNewFolderModal(false)} className="text-ink/40 hover:text-ink p-1 rounded-lg">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <p className="text-ink/60 text-sm mb-4">Enter the event name (e.g. <strong>Sports Day 2026</strong>). A new folder will be created in Cloudinary.</p>
            <form onSubmit={handleCreateFolder} className="space-y-4">
              <input type="text" className="w-full px-4 py-3 rounded-xl border border-ink/15 focus:border-meadow focus:ring-2 focus:ring-meadow/20 outline-none text-ink text-sm" placeholder="e.g. Sports Day 2026" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} autoFocus />
              {newFolderName.trim() && (
                <div className="p-3 bg-cream rounded-xl text-xs text-ink/70">
                  Path: <code className="text-meadow font-semibold">dips-gallery/{slugify(newFolderName)}</code>
                </div>
              )}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowNewFolderModal(false)} className="flex-1 py-2.5 px-4 rounded-xl border border-ink/15 text-ink/70 font-semibold text-sm hover:bg-cream transition-colors">Cancel</button>
                <button type="submit" disabled={!newFolderName.trim() || creatingFolder} className="flex-1 py-2.5 px-4 rounded-xl text-white font-semibold text-sm gradient-meadow hover:opacity-90 disabled:opacity-50 shadow-sm">
                  {creatingFolder ? "Creating..." : "Create Album"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Notices Tab ─────────────────────────────────────────────────────
function NoticesTab({ password, showMsg }: { password: string; showMsg: (t: "success" | "error", s: string) => void }) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [title, setTitle] = useState("");

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notices");
      if (res.ok) { const d = await res.json(); setNotices(d.notices || []); }
    } catch { showMsg("error", "Failed to load notices."); }
    finally { setLoading(false); }
  }, [showMsg]);

  useEffect(() => { fetch_(); }, [fetch_]);

  const handleUpload = async (file: File) => {
    if (!file || !title.trim()) { showMsg("error", "Please enter a title first."); return; }
    setUploading(true);
    try {
      const slug = slugify(title);
      const timestamp = Math.round(Date.now() / 1000).toString();
      const folder = "dips-notices";
      const publicId = `${folder}/${slug}-${timestamp}`;
      const paramsToSign: Record<string, string> = { timestamp, folder, public_id: publicId };
      // Notices can be PDFs — use resource_type auto
      const isRaw = file.type === "application/pdf";
      if (isRaw) paramsToSign.resource_type = "raw";

      const signRes = await fetch("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify({ paramsToSign }),
      });
      if (!signRes.ok) throw new Error("Signing failed");
      const { signature } = await signRes.json();

      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      fd.append("timestamp", timestamp);
      fd.append("signature", signature);
      fd.append("folder", folder);
      fd.append("public_id", publicId);
      if (isRaw) fd.append("resource_type", "raw");

      const resourceType = isRaw ? "raw" : "image";
      const up = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`, { method: "POST", body: fd });
      if (!up.ok) throw new Error("Upload failed");

      showMsg("success", `Notice "${title}" uploaded!`);
      setTitle("");
      await fetch_();
    } catch (err) { showMsg("error", (err as Error).message || "Upload failed"); }
    finally { setUploading(false); }
  };

  const handleDelete = async (publicId: string) => {
    if (!confirm("Delete this notice?")) return;
    setDeletingIds(prev => new Set(prev).add(publicId));
    try {
      const res = await fetch("/api/notices", { method: "DELETE", headers: { "Content-Type": "application/json", "x-admin-password": password }, body: JSON.stringify({ publicId }) });
      if (!res.ok) throw new Error();
      setNotices(prev => prev.filter(n => n.public_id !== publicId));
      showMsg("success", "Notice deleted.");
    } catch { showMsg("error", "Failed to delete."); }
    finally { setDeletingIds(prev => { const n = new Set(prev); n.delete(publicId); return n; }); }
  };

  return (
    <div className="space-y-6">
      {/* Upload notice */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-ink/10 shadow-xs">
        <span className="text-xs font-semibold text-sky uppercase tracking-wider">Upload New Notice</span>
        <h2 className="font-display font-semibold text-ink text-base sm:text-lg mb-1">Add a Notice or Circular</h2>
        <p className="text-xs text-ink/50 mb-4">PDF or image files. Enter the title, then choose the file.</p>

        <div className="space-y-3">
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-ink/15 focus:border-sky focus:ring-2 focus:ring-sky/20 outline-none text-ink text-sm"
            placeholder="Notice title (e.g. Diwali Holiday Notice 2026)"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <label className={`flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl font-semibold text-sm text-white cursor-pointer transition-all active:scale-95 shadow-md ${uploading ? "bg-sky/60 cursor-not-allowed" : "bg-sky hover:bg-sky/90 shadow-sky/20"}`}>
            {uploading ? (
              <><div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> Uploading...</>
            ) : (
              <><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg> Choose File (PDF / Image)</>
            )}
            <input type="file" accept=".pdf,image/*" className="hidden" disabled={uploading} onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0]); }} />
          </label>
          <p className="text-[11px] text-ink/40 text-center">Enter title first, then select file · PDFs &amp; images accepted</p>
        </div>
      </div>

      {/* Notices list */}
      <div>
        <h2 className="font-display font-semibold text-ink text-lg mb-3">All Notices ({notices.length})</h2>
        {loading ? (
          <div className="flex justify-center py-12 bg-white rounded-2xl border border-ink/5">
            <div className="w-8 h-8 rounded-full border-4 border-sky-light border-t-sky animate-spin" />
          </div>
        ) : notices.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-ink/10">
            <p className="text-ink/40 font-semibold">No notices yet</p>
            <p className="text-ink/30 text-xs mt-1">Upload a notice above to get started.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notices.map(n => (
              <div key={n.public_id} className={`flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-ink/10 shadow-xs transition-all ${deletingIds.has(n.public_id) ? "opacity-30" : ""}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${n.format === "pdf" ? "bg-blossom-light text-blossom" : "bg-sky-light text-sky"}`}>
                  {n.format === "pdf" ? "PDF" : "IMG"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink text-sm truncate">{n.title}</p>
                  <p className="text-xs text-ink/40">{new Date(n.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {formatBytes(n.bytes)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a href={n.url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-sky hover:text-sky/80 px-2.5 py-1.5 rounded-lg bg-sky-light transition-colors">View</a>
                  <button onClick={() => handleDelete(n.public_id)} disabled={deletingIds.has(n.public_id)} className="p-1.5 rounded-lg text-ink/30 hover:text-blossom hover:bg-blossom-light transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Documents Tab ────────────────────────────────────────────────────
const DOC_CATEGORIES = [
  { slug: "mandatory-disclosure", label: "Mandatory Disclosure" },
  { slug: "fee-structure", label: "Fee Structure" },
  { slug: "academic-calendar", label: "Academic Calendar" },
  { slug: "circular", label: "Circular / Order" },
  { slug: "results", label: "Results" },
  { slug: "other", label: "Other" },
];

type Doc = {
  public_id: string;
  url: string;
  title: string;
  created_at: string;
  format: string;
  bytes: number;
  category: string;
};

function DocumentsTab({ password, showMsg }: { password: string; showMsg: (t: "success" | "error", s: string) => void }) {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("mandatory-disclosure");
  const [filterCat, setFilterCat] = useState("all");

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/documents");
      if (res.ok) { const d = await res.json(); setDocs(d.documents || []); }
    } catch { showMsg("error", "Failed to load documents."); }
    finally { setLoading(false); }
  }, [showMsg]);

  useEffect(() => { fetch_(); }, [fetch_]);

  const handleUpload = async (file: File) => {
    if (!file || !title.trim()) { showMsg("error", "Please enter a title first."); return; }
    setUploading(true);
    try {
      const slug = slugify(title);
      const timestamp = Math.round(Date.now() / 1000).toString();
      const folder = `dips-documents/${category}`;
      const publicId = `${folder}/${slug}-${timestamp}`;
      const isRaw = file.type === "application/pdf";
      const paramsToSign: Record<string, string> = { timestamp, folder, public_id: publicId };
      if (isRaw) paramsToSign.resource_type = "raw";

      const signRes = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify({ paramsToSign }),
      });
      if (!signRes.ok) throw new Error("Signing failed");
      const { signature } = await signRes.json();

      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      fd.append("timestamp", timestamp);
      fd.append("signature", signature);
      fd.append("folder", folder);
      fd.append("public_id", publicId);
      if (isRaw) fd.append("resource_type", "raw");

      const resourceType = isRaw ? "raw" : "image";
      const up = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`, { method: "POST", body: fd });
      if (!up.ok) throw new Error("Upload failed");

      showMsg("success", `Document "${title}" uploaded!`);
      setTitle("");
      await fetch_();
    } catch (err) { showMsg("error", (err as Error).message || "Upload failed"); }
    finally { setUploading(false); }
  };

  const handleDelete = async (publicId: string) => {
    if (!confirm("Delete this document?")) return;
    setDeletingIds(prev => new Set(prev).add(publicId));
    try {
      const res = await fetch("/api/documents", { method: "DELETE", headers: { "Content-Type": "application/json", "x-admin-password": password }, body: JSON.stringify({ publicId }) });
      if (!res.ok) throw new Error();
      setDocs(prev => prev.filter(d => d.public_id !== publicId));
      showMsg("success", "Document deleted.");
    } catch { showMsg("error", "Failed to delete."); }
    finally { setDeletingIds(prev => { const n = new Set(prev); n.delete(publicId); return n; }); }
  };

  const displayed = filterCat === "all" ? docs : docs.filter(d => d.category === filterCat);

  return (
    <div className="space-y-6">
      {/* Upload */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-ink/10 shadow-xs">
        <span className="text-xs font-semibold text-sun-ink uppercase tracking-wider">Upload New Document</span>
        <h2 className="font-display font-semibold text-ink text-base sm:text-lg mb-1">Add a School Document</h2>
        <p className="text-xs text-ink/50 mb-4">PDF or image. Choose category, enter title, then select file.</p>

        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-ink/70 block mb-1">Category</label>
              <select className="w-full px-4 py-3 rounded-xl border border-ink/15 focus:border-sun focus:ring-2 focus:ring-sun/20 outline-none text-ink text-sm bg-white" value={category} onChange={e => setCategory(e.target.value)}>
                {DOC_CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-ink/70 block mb-1">Document Title</label>
              <input type="text" className="w-full px-4 py-3 rounded-xl border border-ink/15 focus:border-sun focus:ring-2 focus:ring-sun/20 outline-none text-ink text-sm" placeholder="e.g. Fee Structure 2026-27" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
          </div>
          <label className={`flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl font-semibold text-sm cursor-pointer transition-all active:scale-95 shadow-md ${uploading ? "bg-sun/60 text-white cursor-not-allowed" : "bg-sun text-ink hover:brightness-95 shadow-sun/20"}`}>
            {uploading ? (
              <><div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> Uploading...</>
            ) : (
              <><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg> Choose File (PDF / Image)</>
            )}
            <input type="file" accept=".pdf,image/*" className="hidden" disabled={uploading} onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0]); }} />
          </label>
        </div>
      </div>

      {/* Filter + list */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <h2 className="font-display font-semibold text-ink text-lg">All Documents ({displayed.length})</h2>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => setFilterCat("all")} className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${filterCat === "all" ? "bg-ink text-white" : "bg-white text-ink/70 border border-ink/10"}`}>All ({docs.length})</button>
            {DOC_CATEGORIES.map(c => {
              const count = docs.filter(d => d.category === c.slug).length;
              if (!count) return null;
              return <button key={c.slug} onClick={() => setFilterCat(c.slug)} className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${filterCat === c.slug ? "bg-ink text-white" : "bg-white text-ink/70 border border-ink/10"}`}>{c.label} ({count})</button>;
            })}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12 bg-white rounded-2xl border border-ink/5">
            <div className="w-8 h-8 rounded-full border-4 border-sun-light border-t-sun-ink animate-spin" />
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-ink/10">
            <p className="text-ink/40 font-semibold">No documents yet</p>
            <p className="text-ink/30 text-xs mt-1">Upload a document above.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayed.map(d => (
              <div key={d.public_id} className={`flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-ink/10 shadow-xs transition-all ${deletingIds.has(d.public_id) ? "opacity-30" : ""}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${d.format === "pdf" ? "bg-blossom-light text-blossom" : "bg-sun-light text-sun-ink"}`}>
                  {d.format === "pdf" ? "PDF" : "IMG"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink text-sm truncate">{d.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-semibold bg-sun-light text-sun-ink px-2 py-0.5 rounded-full">{DOC_CATEGORIES.find(c => c.slug === d.category)?.label || d.category}</span>
                    <span className="text-xs text-ink/40">{new Date(d.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {formatBytes(d.bytes)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a href={d.url} target="_blank" rel="noreferrer" className="text-xs font-semibold text-sun-ink hover:opacity-80 px-2.5 py-1.5 rounded-lg bg-sun-light transition-colors">View</a>
                  <button onClick={() => handleDelete(d.public_id)} disabled={deletingIds.has(d.public_id)} className="p-1.5 rounded-lg text-ink/30 hover:text-blossom hover:bg-blossom-light transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────
export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("gallery");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showMsg = useCallback((type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(""); setAuthLoading(true);
    try {
      const res = await fetch("/api/gallery/images", { headers: { "x-admin-password": password } });
      if (res.ok) { setIsAuthenticated(true); }
      else { setAuthError("Incorrect password. Please try again."); }
    } catch { setAuthError("Connection error. Please try again."); }
    finally { setAuthLoading(false); }
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode; color: string }[] = [
    {
      id: "gallery", label: "Gallery", color: "meadow",
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
    },
    {
      id: "notices", label: "Notice Board", color: "sky",
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="12" y2="17" /></svg>
    },
    {
      id: "documents", label: "Documents", color: "sun-ink",
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-3a2 2 0 0 1-2-2V2" /><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2H9Z" /><line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" /></svg>
    },
  ];

  // ─── Login Screen ───
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl gradient-meadow flex items-center justify-center mx-auto mb-4 shadow-lg shadow-meadow/30">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <h1 className="font-display text-2xl font-bold text-ink">DIPS Staff Portal</h1>
            <p className="text-ink/55 mt-2 text-sm">Manage gallery, notices &amp; documents</p>
          </div>

          <form onSubmit={handleLogin} className="bg-white rounded-2xl p-8 border border-ink/10 shadow-xl space-y-4">
            <div>
              <label className="text-xs font-bold text-ink block mb-1.5" htmlFor="admin-password">Admin Password</label>
              <input id="admin-password" type="password" className="w-full px-4 py-3 rounded-xl border border-ink/15 focus:border-meadow focus:ring-2 focus:ring-meadow/20 outline-none text-ink text-sm bg-white" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter staff password" autoFocus />
            </div>
            {authError && (
              <p className="text-blossom text-sm flex items-center gap-1.5 font-medium">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                {authError}
              </p>
            )}
            <button type="submit" disabled={authLoading || !password} className="w-full py-3 px-6 rounded-xl font-bold text-white gradient-meadow hover:opacity-90 shadow-md shadow-meadow/25 transition-all active:scale-[0.99] disabled:opacity-60">
              {authLoading ? "Checking..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-xs text-ink/30 mt-6">DIPS Umred Staff Portal · Secure Access</p>
        </div>
      </div>
    );
  }

  // ─── Admin Dashboard ───
  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-ink/10 sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-meadow flex items-center justify-center shadow-xs">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <div>
              <h1 className="font-display font-bold text-ink text-base sm:text-lg leading-tight">DIPS Staff Portal</h1>
              <p className="text-[11px] text-ink/40">Deoraoji Itankar Public School, Umred</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <a href="/" target="_blank" rel="noreferrer" className="text-xs font-semibold text-meadow hover:text-meadow-dark flex items-center gap-1 transition-colors px-2.5 py-1.5">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
              <span className="hidden sm:inline">View Site</span>
            </a>
            <button onClick={() => { setIsAuthenticated(false); setPassword(""); }} className="text-xs sm:text-sm text-ink/40 hover:text-blossom font-semibold transition-colors px-2.5 py-1.5">
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${activeTab === t.id ? `border-meadow text-meadow` : "border-transparent text-ink/50 hover:text-ink"}`}
            >
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
              <span className="sm:hidden">{t.label.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === "gallery" && <GalleryTab password={password} showMsg={showMsg} />}
        {activeTab === "notices" && <NoticesTab password={password} showMsg={showMsg} />}
        {activeTab === "documents" && <DocumentsTab password={password} showMsg={showMsg} />}
      </main>

      <Toast msg={message} />
    </div>
  );
}
