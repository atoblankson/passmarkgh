import { NextRequest, NextResponse } from "next/server";
import { initializePaystackTransaction } from "@/lib/paystack";
import { createAdminSupabaseClient } from "@/lib/supabase/admin-client";

async function resolveActiveMode(req: NextRequest): Promise<string> {
  try {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("admin_settings")
      .select("value")
      .eq("key", "paystack_mode")
      .single();

    if (!error && data?.value) {
      return data.value;
    }
  } catch {
    // Supabase unavailable — fall through to env var
  }

  const cookieMode = req.cookies.get("pm_paystack_mode")?.value;
  return cookieMode || process.env.PAYSTACK_MODE || "test";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, amountInCedis = 15, metadata, callbackUrl, passFeesToCustomer = true } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { status: false, message: "A valid email address is required to initiate Paystack payment." },
        { status: 400 }
      );
    }

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const defaultCallback = `${protocol}://${host}/results`;

    const activeMode = await resolveActiveMode(req);

    const paystackRes = await initializePaystackTransaction({
      email,
      amountInCedis: Number(amountInCedis) || 15,
      metadata: metadata || {},
      callbackUrl: callbackUrl || defaultCallback,
      mode: activeMode,
      passFeesToCustomer: passFeesToCustomer !== false,
    });

    if (!paystackRes.status || !paystackRes.data) {
      return NextResponse.json(
        { status: false, message: paystackRes.message || "Failed to initialize payment with Paystack." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: true,
      message: "Payment initialized successfully",
      data: paystackRes.data,
    });
  } catch (error: unknown) {
    console.error("Paystack Init Error:", error);
    const message = error instanceof Error ? error.message : "Internal server error initializing payment";
    return NextResponse.json({ status: false, message }, { status: 500 });
  }
}