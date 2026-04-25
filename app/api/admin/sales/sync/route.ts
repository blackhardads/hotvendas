import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getTransactionStatus } from "@/lib/syncpay";

// POST /api/admin/sales/sync
// Checks all pending sales against NexusPag and updates their status in the DB.
export async function POST(req: NextRequest) {
  // Verify admin session
  const cookie = req.cookies.get("admin_tok")?.value;
  if (!cookie) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  try {
    const { data: pending } = await supabaseAdmin
      .from("sales")
      .select("identifier")
      .eq("status", "pending");

    if (!pending || pending.length === 0) {
      return NextResponse.json({ updated: 0 });
    }

    let updated = 0;

    await Promise.all(
      (pending as { identifier: string }[]).map(async ({ identifier }) => {
        try {
          const data = await getTransactionStatus(identifier);
          if (data.status !== "pending") {
            await supabaseAdmin
              .from("sales")
              .update({ status: data.status })
              .eq("identifier", identifier);
            updated++;
          }
        } catch {
          // Skip individual failures
        }
      })
    );

    return NextResponse.json({ updated, total: pending.length });
  } catch (err) {
    console.error("[sales/sync]", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
