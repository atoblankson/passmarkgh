export interface InitializePaymentParams {
  email: string;
  amountInCedis: number;
  metadata?: Record<string, unknown>;
  callbackUrl?: string;
}

export interface PaystackInitResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    status: "success" | "failed" | "abandoned" | "reversed";
    reference: string;
    amount: number; // in pesewas
    currency: string;
    customer: {
      email: string;
      customer_code?: string;
    };
    channel: string;
    paid_at?: string;
    metadata?: Record<string, unknown>;
  };
}

/**
 * Initialize a transaction on Paystack Server
 */
export async function initializePaystackTransaction({
  email,
  amountInCedis,
  metadata = {},
  callbackUrl,
}: InitializePaymentParams): Promise<PaystackInitResponse> {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey || secretKey.includes("your_secret_key_here")) {
    return {
      status: false,
      message: "Paystack API key is not configured. Please add your real Secret Key (sk_test_... or sk_live_...) to .env.local",
    };
  }

  // Convert Cedis to Pesewas (1 GHS = 100 Pesewas)
  const amountInPesewas = Math.round(amountInCedis * 100);

  const payload: Record<string, unknown> = {
    email,
    amount: amountInPesewas,
    currency: "GHS",
    channels: ["mobile_money", "card"],
    metadata,
  };

  if (callbackUrl) {
    payload.callback_url = callbackUrl;
  }

  try {
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok && data.message === "Invalid key") {
      return {
        status: false,
        message: "Paystack API key is invalid. Please verify your PAYSTACK_SECRET_KEY (sk_test_... or sk_live_...) in .env.local",
      };
    }
    return data;
  } catch (err: unknown) {
    console.error("Paystack fetch error:", err);
    return {
      status: false,
      message: "Could not connect to Paystack servers. Please check your internet connection.",
    };
  }
}

/**
 * Verify a transaction on Paystack Server
 */
export async function verifyPaystackTransaction(
  reference: string
): Promise<PaystackVerifyResponse> {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey || secretKey.includes("your_secret_key_here")) {
    return {
      status: false,
      message: "Paystack API key is not configured in .env.local",
    };
  }

  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await response.json();
    return data;
  } catch (err: unknown) {
    console.error("Paystack verification fetch error:", err);
    return {
      status: false,
      message: "Could not connect to Paystack to verify payment.",
    };
  }
}
