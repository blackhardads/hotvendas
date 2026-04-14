import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// PUT /api/admin/content/[id] — update a content block
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { type, title, value, display_order } = await req.json();

    const updates: Record<string, unknown> = {};
    if (type !== undefined) updates.type = type;
    if (title !== undefined) updates.title = title;
    if (value !== undefined) updates.value = value;
    if (display_order !== undefined) updates.display_order = display_order;

    const { error } = await supabaseAdmin
      .from("paid_content")
      .update(updates)
      .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/content PUT]", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}

// DELETE /api/admin/content/[id] — delete a content block
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabaseAdmin
      .from("paid_content")
      .delete()
      .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/content DELETE]", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
