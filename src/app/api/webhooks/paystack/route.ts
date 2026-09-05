import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      console.error("Paystack Webhook: PAYSTACK_SECRET_KEY is missing in environment variables.");
      return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
    }

    const signature = req.headers.get("x-paystack-signature");
    if (!signature) {
      return NextResponse.json({ message: "No signature provided" }, { status: 400 });
    }

    const rawBody = await req.text();
    const hash = crypto.createHmac("sha512", secretKey).update(rawBody).digest("hex");

    if (hash !== signature) {
      console.warn("Paystack Webhook: Invalid signature attempt rejected.");
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    // Handle charge.success event
    if (event.event === "charge.success") {
      const data = event.data;
      const reference = data.reference;
      const email = data.customer?.email?.toLowerCase().trim() || "unknown";
      const amount = data.amount; // in pesewas
      const channel = data.channel;
      const paidAt = data.paid_at || new Date().toISOString();
      const metadata = data.metadata || {};

      try {
        const supabase = await createClient();

        // Upsert into payments table
        const { data: paymentRecord, error: paymentError } = await supabase
          .from("payments")
          .upsert(
            {
              reference,
              email,
              amount,
              status: "success",
              channel,
              paid_at: paidAt,
              metadata,
              paystack_response: data,
            },
            { onConflict: "reference" }
          )
          .select("id")
          .single();

        if (paymentError) {
          console.warn("Supabase payment webhook upsert notice:", paymentError.message);
        }

        // If check_id was passed in metadata, mark check as paid
        if (metadata.check_id && paymentRecord?.id) {
          await supabase
            .from("checks")
            .update({
              is_paid: true,
              payment_id: paymentRecord.id,
            })
            .eq("id", metadata.check_id);
        }
      } catch (dbErr) {
        console.warn("Supabase webhook processing notice:", dbErr);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: unknown) {
    console.error("Paystack Webhook Error:", err);
    return NextResponse.json(
      { message: "Webhook handler error" },
      { status: 500 }
    );
  }
}
