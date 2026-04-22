const BASE_URL = process.env.SYNCPAY_BASE_URL ?? "https://app.syncpay.com.br";

// ─── Token cache (in-memory, server lifetime) ────────────────────────────────
let cached: { token: string; expiresAt: number } | null = null;

export async function getAccessToken(): Promise<string> {
  if (cached && Date.now() < cached.expiresAt - 60_000) return cached.token;

  const res = await fetch(`${BASE_URL}/api/partner/v1/auth-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: process.env.SYNCPAY_CLIENT_ID,
      client_secret: process.env.SYNCPAY_CLIENT_SECRET,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`SyncPay auth failed ${res.status}: ${body}`);
  }

  const data = await res.json();
  cached = {
    token: data.access_token as string,
    expiresAt: Date.now() + (data.expires_in as number) * 1_000,
  };
  return cached.token;
}

// ─── Create PIX cash-in ───────────────────────────────────────────────────────
export interface CashInResponse {
  message: string;
  pix_code: string;
  identifier: string;
}

export async function createPixCharge(
  amount: number,
  description: string
): Promise<CashInResponse> {
  const token = await getAccessToken();
  const webhookUrl =
    (process.env.NEXT_PUBLIC_APP_URL ?? "https://millyprivacy.com") +
    "/api/payment/webhook";

  const res = await fetch(`${BASE_URL}/api/partner/v1/cash-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      amount,
      description,
      webhook_url: webhookUrl,
      client: {
        name: "Cliente",
        cpf: "00000000191",
        email: "cliente@millyprivacy.com",
        phone: "11999999999",
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`SyncPay cash-in failed ${res.status}: ${body}`);
  }

  return res.json();
}

// ─── Query transaction status ─────────────────────────────────────────────────
export interface TransactionStatus {
  reference_id: string;
  currency: string;
  amount: number;
  transaction_date: string;
  status: "pending" | "completed" | "failed" | "refunded" | "med";
  description: string | null;
  pix_code: string | null;
}

export async function getTransactionStatus(
  identifier: string
): Promise<TransactionStatus> {
  const token = await getAccessToken();

  const res = await fetch(
    `${BASE_URL}/api/partner/v1/transaction/${identifier}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`SyncPay status failed ${res.status}: ${body}`);
  }

  const data = await res.json();
  console.log("[SyncPay transaction]", JSON.stringify(data, null, 2));
  return data.data as TransactionStatus;
}
