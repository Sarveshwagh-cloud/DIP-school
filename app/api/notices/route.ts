import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

const NOTICES_FOLDER = "dips-notices";

type CloudinaryResource = {
  public_id: string;
  secure_url: string;
  created_at: string;
  format: string;
  bytes: number;
};

// Turn a public_id into a readable title.
// Example: "dips-notices/diwali-holiday-notice-1738000000" -> "Diwali Holiday Notice"
function titleFromPublicId(publicId: string): string {
  const parts = publicId.split("/");
  let name = parts[parts.length - 1];
  name = name.replace(/-\d{6,}$/, "");
  const spaced = name.replace(/[-_]+/g, " ").trim();
  return spaced.replace(/\b\w/g, (char) => char.toUpperCase());
}

// GET /api/notices -> list all notices (public, no password needed to read)
export async function GET() {
  try {
    // Notices can be PDFs (raw) or images (png/jpg)
    const [rawResult, imgResult] = await Promise.all([
      cloudinary.api
        .resources({
          type: "upload",
          resource_type: "raw",
          prefix: NOTICES_FOLDER,
          max_results: 500,
        })
        .catch(() => ({ resources: [] })),
      cloudinary.api
        .resources({
          type: "upload",
          resource_type: "image",
          prefix: NOTICES_FOLDER,
          max_results: 500,
        })
        .catch(() => ({ resources: [] })),
    ]);

    const all = [...(rawResult.resources || []), ...(imgResult.resources || [])];

    const notices = all.map((r: CloudinaryResource) => ({
      public_id: r.public_id,
      url: r.secure_url,
      title: titleFromPublicId(r.public_id),
      created_at: r.created_at,
      format: r.format || (r.public_id.endsWith(".pdf") ? "pdf" : "file"),
      bytes: r.bytes,
    }));

    notices.sort(
      (a: { created_at: string }, b: { created_at: string }) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({ notices });
  } catch (err) {
    console.error("Failed to fetch notices:", err);
    return NextResponse.json({ error: "Failed to fetch notices" }, { status: 500 });
  }
}

// POST /api/notices -> sign an upload request (admin password required)
export async function POST(request: Request) {
  try {
    const adminPassword = request.headers.get("x-admin-password");
    if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paramsToSign } = await request.json();

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({ signature });
  } catch {
    return NextResponse.json({ error: "Failed to sign" }, { status: 500 });
  }
}

// DELETE /api/notices -> delete a notice by public_id (admin password required)
export async function DELETE(request: Request) {
  try {
    const adminPassword = request.headers.get("x-admin-password");
    if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { publicId } = await request.json();
    if (!publicId) {
      return NextResponse.json({ error: "Missing publicId" }, { status: 400 });
    }

    // Notice could be raw (PDF) or image
    let result;
    try {
      result = await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
      if (result.result !== "ok") {
        result = await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
      }
    } catch {
      result = await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    }

    return NextResponse.json({ result });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
