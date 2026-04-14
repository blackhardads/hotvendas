import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// GET /api/admin/content?creator=yasmin  — list all or filter by creator
export async function GET(req: NextRequest) {
  try {
    const creator = req.nextUrl.searchParams.get("creator");

    let base = supabaseAdmin
      .from("paid_content")
      .select("id, creator, type, title, value, display_order, created_at");

    if (creator) {
      base = base.eq("creator", creator);
    }

    const { data, error } = await base.order("display_order", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // When listing all creators, sort by creator then order in JS
    const blocks = creator
      ? (data ?? [])
      : (data ?? []).sort((a: { creator: string; display_order: number }, b: { creator: string; display_order: number }) =>
          a.creator.localeCompare(b.creator) || a.display_order - b.display_order
        );

    return NextResponse.json({ blocks });
  } catch (err) {
    console.error("[admin/content GET]", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}

// POST /api/admin/content — create a new content block
export async function POST(req: NextRequest) {
  try {
    const { creator, type, title, value, display_order } = await req.json();

    if (!creator || !type || !value) {
      return NextResponse.json({ error: "creator, type e value são obrigatórios." }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("paid_content")
      .insert({ creator, type, title: title ?? null, value, display_order: display_order ?? 0 });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/content POST]", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
