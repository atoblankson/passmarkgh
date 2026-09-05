import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Settings are managed via Vercel environment variables.
// PAYSTACK_MODE=live or PAYSTACK_MODE=test in Vercel dashboard.
export async function GET() {
  const mode = process.env.PAYSTACK_MODE || "test";
  return NextResponse.json({
    status: true,
    data: {
      paystackMode: mode === "live" ? "live" : "test",
      updatedAt: new Date().toISOString(),
    },
  });
}

export async function POST() {
  return NextResponse.json(
    {
      status: false,
      message:
        "Mode switching via API is disabled. Change PAYSTACK_MODE in your Vercel environment variables.",
    },
    { status: 403 }
  );
}