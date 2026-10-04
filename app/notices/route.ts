import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

// Folder in Cloudinary where notice files are stored
const NOTICES_FOLDER = "dips-notices";

// Turn a public_id into a readable title.
// Example: "dips-notices/diwali-holiday-notice-1738000000" -> "Diwali Holiday Notice"
function titleFromPublicId(publicId: string): string {
  const parts = publicId.split("/");
  let name = parts[parts.length - 1];
  // Remove the trailing "-<timestamp>" we add when uploading (6 or more digits)
  name = name.replace(/-\d{6,}$/, "");
  const spaced = name.replace(/[-_]+/g, " ").trim();
  return spaced.replace(/\b\w/g, (char) => char.toUpperCase());
}

// GET /api/notices  -> list all notices (public, no password needed to read)
export async function GET() {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: NOTICES_FOLDER,
      max_results: 500,
    });

    const notices = result.resources.map((r: { public_id: string; secure_url: string; created_at: string; format: string; bytes: number }) => ({
      public_id: r.public_id,
      url: r.secure_url,
      title: titleFromPublicId(r.public_id),
      created_at: r.created_at,
      format: r.format,
      bytes: r.bytes,
    }));

    notices.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({ notices });
  } catch (err) {
    console.error("Failed to fetch notices:", err);
    return NextResponse.json({ error: "Failed to fetch notices" }, { status: 500 });
  }
}

// POST /api/notices  -> sign an upload request (admin password required)
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

// DELETE /api/notices  -> delete a notice by public_id (admin password required)
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

    const result = await cloudinary.uploader.destroy(publicId);
    return NextResponse.json({ result });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
