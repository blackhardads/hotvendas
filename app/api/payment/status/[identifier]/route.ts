import { NextRequest, NextResponse } from "next/server";
import { getTransactionStatus } from "@/lib/syncpay";
import { sendSaleNotification } from "@/lib/telegram";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  try {
    const { identifier } = await params;

    if (!identifier) {
      return NextResponse.json({ error: "identifier obrigatório." }, { status: 400 });
    }

    const data = await getTransactionStatus(identifier);

    if (data.status === "completed") {
      await sendSaleNotification(data.amount, identifier, null);
    }

    return NextResponse.json({ status: data.status });
  } catch (err) {
    console.error("[payment/status]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao consultar status." },
      { status: 500 }
    );
  }
}
