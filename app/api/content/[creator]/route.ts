import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ creator: string }> }
) {
  try {
    const { creator } = await params;
    const authHeader = req.headers.get("authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");

    if (!token) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

    const { data: userData, error: authErr } = await supabaseAdmin.auth.getUser(token);
    if (authErr || !userData.user) {
      return NextResponse.json({ error: "Token inválido." }, { status: 401 });
    }

    const userId = userData.user.id;

    // Verify purchase
    const { data: purchases } = await supabaseAdmin
      .from("user_purchases")
      .select("id")
      .eq("user_id", userId)
      .eq("creator", creator)
      .limit(1);

    if (!purchases || purchases.length === 0) {
      return NextResponse.json({ error: "Sem acesso para este criador." }, { status: 403 });
    }

    // Fetch content blocks
    const { data: blocks, error: contentErr } = await supabaseAdmin
      .from("paid_content")
      .select("id, creator, type, title, value, display_order")
      .eq("creator", creator)
      .order("display_order", { ascending: true });

    if (contentErr) return NextResponse.json({ error: "Erro ao buscar conteúdo." }, { status: 500 });

    // Fetch reaction counts and user's reactions for these blocks
    const blockIds = (blocks ?? []).map((b: { id: string }) => b.id);
    let reactionCounts: Record<string, number> = {};
    let userReacted: Record<string, boolean> = {};

    if (blockIds.length > 0) {
      const { data: reactions } = await supabaseAdmin
        .from("content_reactions")
        .select("block_id, user_id")
        .in("block_id", blockIds);

      if (reactions) {
        for (const r of reactions as { block_id: string; user_id: string }[]) {
          reactionCounts[r.block_id] = (reactionCounts[r.block_id] ?? 0) + 1;
          if (r.user_id === userId) userReacted[r.block_id] = true;
        }
      }
    }

    const enriched = (blocks ?? []).map((b: { id: string }) => ({
      ...b,
      reactions: reactionCounts[b.id] ?? 0,
      userReacted: userReacted[b.id] ?? false,
    }));

    return NextResponse.json({ blocks: enriched });
  } catch (err) {
    console.error("[content/creator]", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
