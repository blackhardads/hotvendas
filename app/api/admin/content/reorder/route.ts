import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// PUT /api/admin/content/reorder
// Body: [{ id: string, display_order: number }]
export async function PUT(req: NextRequest) {
  try {
    const items: { id: string; display_order: number }[] = await req.json();
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Array de itens obrigatório." }, { status: 400 });
    }

    await Promise.all(
      items.map(({ id, display_order }) =>
        supabaseAdmin.from("paid_content").update({ display_order }).eq("id", id)
      )
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[content/reorder]", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
