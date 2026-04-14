import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { userId, saleIdentifier, creator, plan } = await req.json();

    if (!userId || !saleIdentifier || !creator) {
      return NextResponse.json({ error: "Dados obrigatórios faltando." }, { status: 400 });
    }

    // Verify that the sale exists and is completed
    const { data: sale } = await supabaseAdmin
      .from("sales")
      .select("status")
      .eq("identifier", saleIdentifier)
      .limit(1);

    if (!sale || sale.length === 0) {
      return NextResponse.json({ error: "Venda não encontrada." }, { status: 404 });
    }

    if (sale[0].status !== "completed") {
      return NextResponse.json({ error: "Pagamento não confirmado." }, { status: 402 });
    }

    // Save purchase association (ignore duplicate error — user may register twice)
    await supabaseAdmin.from("user_purchases").upsert(
      { user_id: userId, sale_identifier: saleIdentifier, creator, plan },
      { onConflict: "sale_identifier" }
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[user/purchase]", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
