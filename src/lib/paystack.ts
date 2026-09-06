export interface InitializePaymentParams {
  email: string;
  amountInCedis: number;
  metadata?: Record<string, unknown>;
  callbackUrl?: string;
  mode?: string;
  passFeesToCustomer?: boolean;
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
 * Standard Ghana Paystack fee rate is 1.95% (0.0195).
 * Paystack charges 1.95% on local transactions (Mobile Money & local cards).
 */
export const PAYSTACK_GH_FEE_RATE = 0.0195;

/**
 * Computes the gross amount (in pesewas) so that after Paystack deducts
 * its 1.95% transaction fee, the merchant receives the exact clean net amount.
 *
 * Formula:
 *   Net = Gross * (1 - feeRate)
 *   Gross = Net / (1 - feeRate)
 *
 * For GHS 15.00 net:
 *   Gross = 15.00 / (1 - 0.0195) = 15.2983... => 15.30 GHS (1530 pesewas)
 *   Paystack fee: 15.30 * 1.95% = 0.29835 GHS => 0.30 GHS (30 pesewas)
 *   Merchant settlement: 15.30 - 0.30 = 15.00 GHS clean.
 */
export function calculateGrossWithPaystackFee(netInCedis: number = 15): {
  grossInPesewas: number;
  grossInCedis: number;
  feeInCedis: number;
  netInCedis: number;
} {
  const grossInPesewas = Math.ceil((netInCedis / (1 - PAYSTACK_GH_FEE_RATE)) * 100);
  const grossInCedis = grossInPesewas / 100;
  const feeInCedis = Math.round((grossInCedis - netInCedis) * 100) / 100;

  return {
    grossInPesewas,
    grossInCedis,
    feeInCedis,
    netInCedis,
  };
}

import fs from "fs";
import path from "path";

/**
 * Resolves the active Paystack Secret Key.
 * Supports PAYSTACK_MODE="live" | "test", persistent admin_config.json, or direct PAYSTACK_SECRET_KEY.
 * Defaults to "live" when live keys or live mode is configured.
 */
export function getPaystackSecretKey(modeOverride?: string): string | undefined {
  let mode = modeOverride;

  // Check persistent config on disk if modeOverride is not provided
  if (!mode) {
    try {
      const configPath = path.join(process.cwd(), "src", "data", "admin_config.json");
      if (fs.existsSync(configPath)) {
        const raw = fs.readFileSync(configPath, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed.paystackMode === "live" || parsed.paystackMode === "test") {
          mode = parsed.paystackMode;
        }
      }
    } catch {}
  }

  const resolvedMode = (
    mode ||
    process.env.PAYSTACK_MODE ||
    (process.env.PAYSTACK_LIVE_SECRET_KEY ? "live" : "test")
  ).toLowerCase();

  if (resolvedMode === "live") {
    return (
      process.env.PAYSTACK_LIVE_SECRET_KEY ||
      (process.env.PAYSTACK_SECRET_KEY?.startsWith("sk_live_") ? process.env.PAYSTACK_SECRET_KEY : undefined) ||
      process.env.PAYSTACK_SECRET_KEY
    );
  }

  return (
    process.env.PAYSTACK_TEST_SECRET_KEY ||
    (process.env.PAYSTACK_SECRET_KEY?.startsWith("sk_test_") ? process.env.PAYSTACK_SECRET_KEY : undefined) ||
    process.env.PAYSTACK_SECRET_KEY
  );
}

/**
 * Initialize a transaction on Paystack Server
 */
export async function initializePaystackTransaction({
  email,
  amountInCedis,
  metadata = {},
  callbackUrl,
  mode,
  passFeesToCustomer = true,
}: InitializePaymentParams): Promise<PaystackInitResponse> {
  const secretKey = getPaystackSecretKey(mode);
  if (!secretKey || secretKey.includes("your_secret_key_here")) {
    return {
      status: false,
      message: "Paystack API key is not configured. Please add your real Secret Key (sk_test_... or sk_live_...) to .env.local",
    };
  }

  // Calculate gross pesewas to pass Paystack processing fee to customer
  const feeCalculation = passFeesToCustomer
    ? calculateGrossWithPaystackFee(amountInCedis)
    : {
        grossInPesewas: Math.round(amountInCedis * 100),
        grossInCedis: amountInCedis,
        feeInCedis: 0,
        netInCedis: amountInCedis,
      };

  const amountInPesewas = feeCalculation.grossInPesewas;

  const payload: Record<string, unknown> = {
    email,
    amount: amountInPesewas,
    currency: "GHS",
    channels: ["mobile_money", "card"],
    metadata: {
      ...metadata,
      base_amount_cedis: amountInCedis,
      charged_amount_cedis: feeCalculation.grossInCedis,
      processing_fee_cedis: feeCalculation.feeInCedis,
      fee_passed_to_customer: passFeesToCustomer,
    },
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
  reference: string,
  mode?: string
): Promise<PaystackVerifyResponse> {
  const secretKey = getPaystackSecretKey(mode);
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
