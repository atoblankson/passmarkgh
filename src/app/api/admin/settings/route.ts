import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const CONFIG_PATH = path.join(process.cwd(), "src", "data", "admin_config.json");

function getSavedMode(): "live" | "test" {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed.paystackMode === "live" || parsed.paystackMode === "test") {
        return parsed.paystackMode;
      }
    }
  } catch {}
  return (process.env.PAYSTACK_MODE === "test" ? "test" : "live");
}

export async function GET(req: NextRequest) {
  const cookieMode = req.cookies.get("pm_paystack_mode")?.value;
  const activeMode = (cookieMode === "test" || cookieMode === "live")
    ? cookieMode
    : getSavedMode();

  return NextResponse.json({
    status: true,
    data: {
      paystackMode: activeMode,
      updatedAt: new Date().toISOString(),
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newMode: "live" | "test" = body.paystackMode === "test" ? "test" : "live";

    process.env.PAYSTACK_MODE = newMode;

    // Save to admin_config.json
    try {
      fs.writeFileSync(
        CONFIG_PATH,
        JSON.stringify({ paystackMode: newMode, updatedAt: new Date().toISOString() }, null, 2),
        "utf-8"
      );
    } catch (fsErr) {
      console.warn("Could not save to admin_config.json:", fsErr);
    }

    // Sync to .env.local if present
    try {
      const envPath = path.join(process.cwd(), ".env.local");
      if (fs.existsSync(envPath)) {
        let content = fs.readFileSync(envPath, "utf-8");
        if (/PAYSTACK_MODE=.*/.test(content)) {
          content = content.replace(/PAYSTACK_MODE=.*/, `PAYSTACK_MODE=${newMode}`);
        } else {
          content = `PAYSTACK_MODE=${newMode}\n` + content;
        }
        fs.writeFileSync(envPath, content, "utf-8");
      }
    } catch {}

    const res = NextResponse.json({
      status: true,
      message: `Paystack mode updated to ${newMode.toUpperCase()}`,
      data: {
        paystackMode: newMode,
        updatedAt: new Date().toISOString(),
      },
    });

    res.cookies.set("pm_paystack_mode", newMode, {
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
    });

    return res;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating admin settings";
    return NextResponse.json({ status: false, message }, { status: 500 });
  }
}