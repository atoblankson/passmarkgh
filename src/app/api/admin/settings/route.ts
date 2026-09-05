import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin-client";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/settings
 * Returns the active Paystack mode from Supabase admin_settings table.
 * Falls back to env var PAYSTACK_MODE if Supabase is unavailable.
 */
export async function GET(_req: NextRequest) {
  try {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("admin_settings")
      .select("value, updated_at")
      .eq("key", "paystack_mode")
      .single();

    if (error || !data) {
      // Graceful fallback to env var
      const fallback = process.env.PAYSTACK_MODE || "test";
      return NextResponse.json({
        status: true,
        data: { paystackMode: fallback, updatedAt: new Date().toISOString() },
      });
    }

    return NextResponse.json({
      status: true,
      data: {
        paystackMode: data.value === "live" ? "live" : "test",
        updatedAt: data.updated_at,
      },
    });
  } catch {
    const fallback = process.env.PAYSTACK_MODE || "test";
    return NextResponse.json({
      status: true,
      data: { paystackMode: fallback, updatedAt: new Date().toISOString() },
    });
  }
}

/**
 * POST /api/admin/settings
 * Upserts Paystack mode into Supabase admin_settings table.
 * This persists across all serverless function instances and environments.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { paystackMode } = body;

    if (!paystackMode || !["test", "live"].includes(paystackMode)) {
      return NextResponse.json(
        { status: false, message: "Invalid paystackMode. Must be 'test' or 'live'." },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();
    const { error } = await supabase.from("admin_settings").upsert(
      {
        key: "paystack_mode",
        value: paystackMode,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );

    if (error) {
      console.error("Supabase admin_settings upsert error:", error);
      return NextResponse.json(
        { status: false, message: "Failed to save settings to database: " + error.message },
        { status: 500 }
      );
    }

    const res = NextResponse.json({
      status: true,
      message: `Paystack mode switched to ${paystackMode.toUpperCase()} and persisted to database.`,
      data: {
        paystackMode,
        updatedAt: new Date().toISOString(),
      },
    });

    // Also set cookie so same-session requests are immediately aware
    res.cookies.set("pm_paystack_mode", paystackMode, {
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
    });

    return res;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error saving admin settings";
    return NextResponse.json({ status: false, message }, { status: 500 });
  }
}
