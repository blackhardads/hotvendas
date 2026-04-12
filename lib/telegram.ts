const BOT_TOKEN = "8277771041:AAFAcOyoWFl-SGoO1MfHjZwWabuTXTjI4OY";
const CHAT_ID = "-1003628669885";

export async function sendSaleNotification(amount: number, identifier: string, page: string | null, plan: string | null = null, transactionDate: string | null = null) {
  const dateStr = transactionDate
    ? new Date(transactionDate).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const text =
    `💰 *Nova venda!*\n` +
    (page ? `📄 Página: *${page}*\n` : "") +
    (plan ? `🎯 Plano: *${plan}*\n` : "") +
    `🔑 Código: \`${identifier}\`\n` +
    `💵 Valor: *R$ ${amount.toFixed(2).replace(".", ",")}*\n` +
    `📅 Data: *${dateStr}*`;

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: "Markdown",
    }),
  });
}
