import { NextRequest, NextResponse } from "next/server";
import { createPixCharge } from "@/lib/syncpay";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { amount, description, creator } = await req.json();

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Valor inválido." }, { status: 400 });
    }

    const data = await createPixCharge(amount, description ?? "Assinatura Milly Privacy");

    // Salva o identifier junto com o creator para o webhook conseguir identificar a página
    if (creator) {
      await supabaseAdmin.from("sales").upsert(
        { identifier: data.identifier, creator, amount, status: "pending" },
        { onConflict: "identifier" }
      );
    }

    return NextResponse.json({
      pix_code: data.pix_code,
      identifier: data.identifier,
    });
  } catch (err) {
    console.error("[payment/create]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao gerar pagamento." },
      { status: 500 }
    );
  }
}
