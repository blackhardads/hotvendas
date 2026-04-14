import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "milly-admin-secret";

function makeToken() {
  return createHmac("sha256", ADMIN_SECRET).update("admin-session").digest("hex");
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token || !ADMIN_PASSWORD) return false;
  return token === makeToken();
}

// POST /api/admin/auth — login
export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_tok", makeToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}

// DELETE /api/admin/auth — logout
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_tok", "", { maxAge: 0, path: "/" });
  return res;
}

// GET /api/admin/auth — check session
export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_tok")?.value;
  if (!verifyAdminToken(token)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
