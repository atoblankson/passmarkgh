import { NextRequest, NextResponse } from "next/server";
import { verifyPaystackTransaction } from "@/lib/paystack";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { status: false, message: "Transaction reference is required." },
        { status: 400 }
      );
    }

    const paystackRes = await verifyPaystackTransaction(reference);

    if (!paystackRes.status || !paystackRes.data) {
      return NextResponse.json(
        { status: false, message: paystackRes.message || "Could not verify transaction with Paystack." },
        { status: 400 }
      );
    }

    const isSuccessful = paystackRes.data.status === "success";

    // Attempt to persist verified payment in Supabase (graceful fallback)
    if (isSuccessful) {
      try {
        const supabase = await createClient();
        await supabase.from("payments").insert([
          {
            reference: paystackRes.data.reference,
            email: paystackRes.data.customer?.email?.toLowerCase().trim() || "unknown",
            amount: paystackRes.data.amount,
            status: paystackRes.data.status,
            channel: paystackRes.data.channel,
            paid_at: paystackRes.data.paid_at || new Date().toISOString(),
            metadata: paystackRes.data.metadata || {},
          },
        ]);
      } catch (dbErr) {
        console.warn("Supabase payment persistence notice (using client storage):", dbErr);
      }
    }

    return NextResponse.json({
      status: isSuccessful,
      message: isSuccessful
        ? "Payment verified successfully"
        : `Payment status is ${paystackRes.data.status}`,
      data: paystackRes.data,
    });
  } catch (error: unknown) {
    console.error("Paystack Verify Error:", error);
    const message = error instanceof Error ? error.message : "Internal server error verifying payment";
    return NextResponse.json(
      { status: false, message },
      { status: 500 }
    );
  }
}
