import { NextRequest, NextResponse } from "next/server";

// Webhook recebido mas notificação é disparada via polling do status
export async function POST(_req: NextRequest) {
  return NextResponse.json({ ok: true });
}
