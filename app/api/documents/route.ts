import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

const DOCS_FOLDER = "dips-documents";

type CloudinaryResource = {
  public_id: string;
  secure_url: string;
  created_at: string;
  format: string;
  bytes: number;
};

function titleFromPublicId(publicId: string): string {
  const parts = publicId.split("/");
  let name = parts[parts.length - 1];
  name = name.replace(/-\d{6,}$/, "");
  return name.replace(/[-_]+/g, " ").trim().replace(/\b\w/g, (c) => c.toUpperCase());
}

function categoryFromPublicId(publicId: string): string {
  const parts = publicId.split("/");
  // dips-documents/<category>/<filename>  → parts[1]
  return parts.length > 2 ? parts[1] : "other";
}

// GET /api/documents — public read
export async function GET() {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      resource_type: "raw",
      prefix: DOCS_FOLDER,
      max_results: 500,
    });

    // Also fetch image-type documents
    const imageResult = await cloudinary.api.resources({
      type: "upload",
      resource_type: "image",
      prefix: DOCS_FOLDER,
      max_results: 500,
    });

    const all = [...(result.resources || []), ...(imageResult.resources || [])];

    const documents = all.map((r: CloudinaryResource) => ({
      public_id: r.public_id,
      url: r.secure_url,
      title: titleFromPublicId(r.public_id),
      created_at: r.created_at,
      format: r.format,
      bytes: r.bytes,
      category: categoryFromPublicId(r.public_id),
    }));

    documents.sort(
      (a: { created_at: string }, b: { created_at: string }) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({ documents });
  } catch (err) {
    console.error("Failed to fetch documents:", err);
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}

// POST /api/documents — return signed upload params (admin only)
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

// DELETE /api/documents — delete by public_id (admin only)
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

    // Try raw first, then image
    let result;
    try {
      result = await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
    } catch {
      result = await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    }

    return NextResponse.json({ result });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
