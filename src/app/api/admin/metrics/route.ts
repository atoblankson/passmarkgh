import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getPaystackSecretKey } from "@/lib/paystack";
import {
  AdminMetricSummary,
  TrendPoint,
  AdminTransaction,
  AdminActivity,
} from "@/lib/admin/admin-data";

export const dynamic = "force-dynamic";

const STORE_PATH = path.join(process.cwd(), "src", "data", "analytics_store.json");

interface PaystackCustomer {
  email?: string;
  phone?: string;
}

interface PaystackRawTx {
  id: number | string;
  status: string;
  reference: string;
  amount: number; // pesewas
  paid_at?: string;
  created_at?: string;
  channel?: string;
  customer?: PaystackCustomer;
  metadata?: {
    aggregate?: string | number;
    totalMatches?: string | number;
    source?: string;
    stream?: string;
    selectedStreamId?: string;
  };
}

function getLocalStore() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, "utf-8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Error reading analytics store:", e);
  }
  return { visits: [], checks: [], activities: [] };
}

export async function GET(req: NextRequest) {
  try {
    const cookieMode = req.cookies.get("pm_paystack_mode")?.value;
    const activeMode = cookieMode || process.env.PAYSTACK_MODE || "test";
    const secretKey = getPaystackSecretKey(activeMode);

    let paystackTxs: PaystackRawTx[] = [];

    if (secretKey && !secretKey.includes("your_secret_key_here")) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const pRes = await fetch("https://api.paystack.co/transaction?perPage=50", {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
          cache: "no-store",
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (pRes.ok) {
          const json = await pRes.json();
          if (json.status && Array.isArray(json.data)) {
            paystackTxs = json.data;
          }
        }
      } catch (pErr) {
        console.warn("Paystack fetch notice in admin route (offline/timeout):", pErr instanceof Error ? pErr.message : pErr);
      }
    }

    // Read real local visits and checks
    const store = getLocalStore();
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    // Filter successful payments
    const successfulTxs = paystackTxs.filter((tx) => tx.status === "success");

    // Map real Paystack transactions
    const realTransactions: AdminTransaction[] = paystackTxs.map((tx) => {
      const txDate = new Date(tx.paid_at || tx.created_at || Date.now());
      const isToday = txDate.getTime() >= startOfToday;
      const formattedDate = isToday
        ? `Today, ${txDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`
        : txDate.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          });

      return {
        id: String(tx.id),
        date: formattedDate,
        timestamp: txDate.toISOString(),
        studentEmailOrPhone: tx.customer?.email || tx.customer?.phone || "candidate@passmarkgh.site",
        amountGhc: tx.amount ? tx.amount / 100 : 15.0,
        reference: tx.reference,
        status: tx.status === "success" ? "success" : "failed",
        channel: tx.channel === "card" ? "card" : "mobile_money",
        stream: (tx.metadata?.stream || tx.metadata?.selectedStreamId as string) || "General Science",
      };
    });

    // Real conversions & revenue
    const totalConversions = successfulTxs.length;
    const todayConversions = successfulTxs.filter(
      (tx) => new Date(tx.paid_at || tx.created_at || 0).getTime() >= startOfToday
    ).length;
    const weekConversions = successfulTxs.filter(
      (tx) => new Date(tx.paid_at || tx.created_at || 0).getTime() >= sevenDaysAgo
    ).length;

    const totalRevenueGhc = successfulTxs.reduce(
      (sum, tx) => sum + (tx.amount ? tx.amount / 100 : 15),
      0
    );
    const todayRevenueGhc = successfulTxs
      .filter((tx) => new Date(tx.paid_at || tx.created_at || 0).getTime() >= startOfToday)
      .reduce((sum, tx) => sum + (tx.amount ? tx.amount / 100 : 15), 0);
    const weekRevenueGhc = successfulTxs
      .filter((tx) => new Date(tx.paid_at || tx.created_at || 0).getTime() >= sevenDaysAgo)
      .reduce((sum, tx) => sum + (tx.amount ? tx.amount / 100 : 15), 0);

    // Real visits
    const totalVisits = store.visits?.length || 0;
    const todayVisits = (store.visits || []).filter(
      (v: { timestamp: string }) => new Date(v.timestamp).getTime() >= startOfToday
    ).length;
    const weekVisits = (store.visits || []).filter(
      (v: { timestamp: string }) => new Date(v.timestamp).getTime() >= sevenDaysAgo
    ).length;
    const monthVisits = (store.visits || []).filter(
      (v: { timestamp: string }) => new Date(v.timestamp).getTime() >= thirtyDaysAgo
    ).length;

    // Real checks
    const totalChecks = store.checks?.length || 0;
    const todayChecks = (store.checks || []).filter(
      (c: { timestamp: string }) => new Date(c.timestamp).getTime() >= startOfToday
    ).length;
    const weekChecks = (store.checks || []).filter(
      (c: { timestamp: string }) => new Date(c.timestamp).getTime() >= sevenDaysAgo
    ).length;

    // Conversion rate
    const effectiveVisits = Math.max(monthVisits || totalVisits, 1);
    const conversionRatePct = Number(((totalConversions / effectiveVisits) * 100).toFixed(1));

    const summary: AdminMetricSummary = {
      visits: {
        today: todayVisits || 1,
        thisWeek: weekVisits || totalVisits || 1,
        thisMonth: monthVisits || totalVisits || 1,
        trendVsLastPeriodPct: 100.0,
      },
      checksRun: {
        total: totalChecks,
        today: todayChecks,
        thisWeek: weekChecks,
      },
      conversions: {
        total: totalConversions,
        today: todayConversions,
        thisWeek: weekConversions,
      },
      conversionRatePct,
      revenue: {
        totalGhc: totalRevenueGhc,
        todayGhc: todayRevenueGhc,
        thisWeekGhc: weekRevenueGhc,
        averagePerDayGhc: totalRevenueGhc > 0 ? Math.round(totalRevenueGhc) : 0,
      },
    };

    // Build real 7-day trend history
    const trends: TrendPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;

      const dayVisits = (store.visits || []).filter((v: { timestamp: string }) => {
        const t = new Date(v.timestamp).getTime();
        return t >= dayStart && t < dayEnd;
      }).length;

      const dayChecks = (store.checks || []).filter((c: { timestamp: string }) => {
        const t = new Date(c.timestamp).getTime();
        return t >= dayStart && t < dayEnd;
      }).length;

      const dayConversions = successfulTxs.filter((tx) => {
        const t = new Date(tx.paid_at || tx.created_at || 0).getTime();
        return t >= dayStart && t < dayEnd;
      }).length;

      const dayRev = dayConversions * 15;

      const dateLabel =
        i === 0
          ? "Today"
          : d.toLocaleDateString("en-GB", { month: "short", day: "numeric" });

      trends.push({
        date: dateLabel,
        fullDate: d.toISOString().slice(0, 10),
        visits: dayVisits,
        checks: dayChecks,
        conversions: dayConversions,
        revenueGhc: dayRev,
      });
    }

    // Build real activity stream from Paystack payments + checks + visits
    const activities: AdminActivity[] = [];

    // Add Paystack transactions to activities
    paystackTxs.forEach((tx) => {
      const txDate = new Date(tx.paid_at || tx.created_at || Date.now());
      const minsAgo = Math.max(1, Math.round((Date.now() - txDate.getTime()) / (60 * 1000)));
      const relTime =
        minsAgo < 60
          ? `${minsAgo}m ago`
          : minsAgo < 1440
          ? `${Math.round(minsAgo / 60)}h ago`
          : `${Math.round(minsAgo / 1440)}d ago`;

      const email = tx.customer?.email || "Student";
      const channelLabel = tx.channel === "card" ? "Card" : "MTN MoMo";

      if (tx.status === "success") {
        activities.push({
          id: `act-tx-${tx.id}`,
          timestamp: txDate.toISOString(),
          relativeTime: relTime,
          eventType: "payment",
          title: `Payment Received (₵${(tx.amount / 100).toFixed(2)})`,
          description: `${email} unlocked full admissions dossier via ${channelLabel} (Ref: ${tx.reference}).`,
          metadata: tx.metadata,
        });
      } else {
        activities.push({
          id: `act-tx-${tx.id}`,
          timestamp: txDate.toISOString(),
          relativeTime: relTime,
          eventType: "payment",
          title: `Payment Failed`,
          description: `${email} attempted check unlock (Ref: ${tx.reference}).`,
        });
      }
    });

    // Add checks to activities
    (store.checks || []).forEach((c: { id: string; timestamp: string; aggregate: number; stream?: string; qualifiedCount?: number; studentEmail?: string }) => {
      const cDate = new Date(c.timestamp);
      const minsAgo = Math.max(1, Math.round((Date.now() - cDate.getTime()) / (60 * 1000)));
      const relTime =
        minsAgo < 60
          ? `${minsAgo}m ago`
          : minsAgo < 1440
          ? `${Math.round(minsAgo / 60)}h ago`
          : `${Math.round(minsAgo / 1440)}d ago`;

      activities.push({
        id: `act-chk-${c.id}`,
        timestamp: c.timestamp,
        relativeTime: relTime,
        eventType: "check",
        title: `Grade Check Run (Aggregate ${c.aggregate})`,
        description: `Candidate calculated Best 6 aggregate for ${c.stream || "General Science"} - matched ${c.qualifiedCount || 0} programmes.`,
      });
    });

    // Add recent visits
    (store.visits || []).slice(0, 5).forEach((v: { id: string; timestamp: string; path: string }) => {
      const vDate = new Date(v.timestamp);
      const minsAgo = Math.max(1, Math.round((Date.now() - vDate.getTime()) / (60 * 1000)));
      const relTime =
        minsAgo < 60
          ? `${minsAgo}m ago`
          : minsAgo < 1440
          ? `${Math.round(minsAgo / 60)}h ago`
          : `${Math.round(minsAgo / 1440)}d ago`;

      activities.push({
        id: `act-v-${v.id}`,
        timestamp: v.timestamp,
        relativeTime: relTime,
        eventType: "visit",
        title: `Visitor on ${v.path}`,
        description: `Visitor accessed ${v.path}.`,
      });
    });

    // Sort activities by timestamp descending
    activities.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({
      status: true,
      data: {
        summary,
        trends,
        transactions: realTransactions,
        activities: activities.slice(0, 15),
      },
    });
  } catch (error: unknown) {
    console.error("Admin metrics API error:", error);
    const message = error instanceof Error ? error.message : "Internal server error fetching metrics";
    return NextResponse.json({ status: false, message }, { status: 500 });
  }
}
