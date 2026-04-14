import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// POST /api/content/react
// Toggles a reaction (heart) for the authenticated user on a content block.
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

    const { data: userData, error: authErr } = await supabaseAdmin.auth.getUser(token);
    if (authErr || !userData.user) {
      return NextResponse.json({ error: "Token inválido." }, { status: 401 });
    }

    const userId = userData.user.id;
    const { blockId } = await req.json();
    if (!blockId) return NextResponse.json({ error: "blockId obrigatório." }, { status: 400 });

    // Check if reaction already exists
    const { data: existing } = await supabaseAdmin
      .from("content_reactions")
      .select("id")
      .eq("user_id", userId)
      .eq("block_id", blockId)
      .limit(1);

    if (existing && existing.length > 0) {
      // Remove reaction (toggle off)
      await supabaseAdmin
        .from("content_reactions")
        .delete()
        .eq("user_id", userId)
        .eq("block_id", blockId);
      return NextResponse.json({ reacted: false });
    } else {
      // Add reaction (toggle on)
      await supabaseAdmin
        .from("content_reactions")
        .insert({ user_id: userId, block_id: blockId });
      return NextResponse.json({ reacted: true });
    }
  } catch (err) {
    console.error("[content/react]", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
