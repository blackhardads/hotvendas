const BASE_URL = "https://nexuspag.com";

export interface CreatePixChargeResponse {
  success: boolean;
  transaction: {
    id: string;
    txid: string;
    external_id?: string;
    amount: number;
    fee: number;
    fee_percent: number;
    net_amount: number;
    status: "pending" | "paid" | "expired" | "cancelled";
    pix_copia_cola: string;
    qr_code_base64: string;
    expires_at: string;
    splits_preview?: {
      owner_net_amount: number;
      splits: Array<{
        user_id: string;
        amount: number;
      }>;
    };
  };
}

export interface PixChargeResponse {
  pix_code: string;
  identifier: string;
  qr_code: string;
  status: string;
}

export async function createPixCharge(
  amount: number,
  description: string,
  external_id?: string
): Promise<PixChargeResponse> {
  const apiKey = process.env.NEXUSPAG_API_KEY;
  if (!apiKey) {
    throw new Error("NEXUSPAG_API_KEY not configured");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://millyprivacy.com";
  const body: Record<string, any> = {
    amount,
    description,
    external_id: external_id || `pix-${Date.now()}`,
    expiration: 1800,
  };

  // Only include webhook_url if in production (not localhost)
  if (!appUrl.includes("localhost")) {
    body.webhook_url = `${appUrl}/api/payment/webhook`;
  }

  const res = await fetch(`${BASE_URL}/api/pix/create`, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`NexusPag create PIX failed ${res.status}: ${body}`);
  }

  const data = (await res.json()) as CreatePixChargeResponse;

  return {
    pix_code: data.transaction.pix_copia_cola,
    qr_code: data.transaction.qr_code_base64,
    identifier: data.transaction.id,
    status: data.transaction.status,
  };
}

export interface TransactionStatus {
  reference_id: string;
  currency: string;
  amount: number;
  transaction_date: string;
  status: "pending" | "completed" | "failed" | "refunded" | "expired";
  description: string | null;
  pix_code: string | null;
  net_amount?: number;
  fee?: number;
  owner_net_amount?: number;
  paid_at?: string;
}

export async function getTransactionStatus(
  identifier: string
): Promise<TransactionStatus> {
  const apiKey = process.env.NEXUSPAG_API_KEY;
  if (!apiKey) {
    throw new Error("NEXUSPAG_API_KEY not configured");
  }

  const res = await fetch(`${BASE_URL}/api/pix/${identifier}`, {
    headers: {
      "x-api-key": apiKey,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`NexusPag status failed ${res.status}: ${body}`);
  }

  const data = await res.json();
  console.log("[NexusPag transaction]", JSON.stringify(data, null, 2));

  // Map NexusPag status to internal status
  const statusMap: Record<string, "pending" | "completed" | "failed" | "expired" | "refunded"> = {
    pending: "pending",
    paid: "completed",
    cancelled: "failed",
    expired: "expired",
  };

  return {
    reference_id: data.external_id || data.id,
    currency: "BRL",
    amount: data.amount || 0,
    transaction_date: data.created_at || new Date().toISOString(),
    status: statusMap[data.status] || "pending",
    description: data.description || null,
    pix_code: data.pix_copia_cola || null,
    net_amount: data.net_amount,
    fee: data.fee,
    owner_net_amount: data.splits?.owner_net_amount,
    paid_at: data.paid_at,
  };
}
