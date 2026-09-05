import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const STORE_PATH = path.join(process.cwd(), "src", "data", "analytics_store.json");

interface AnalyticsStore {
  visits: Array<{ id: string; timestamp: string; path: string }>;
  checks: Array<{
    id: string;
    timestamp: string;
    aggregate: number;
    stream?: string;
    qualifiedCount?: number;
    studentEmail?: string;
  }>;
  activities: Array<{
    id: string;
    timestamp: string;
    eventType: "visit" | "check" | "payment";
    title: string;
    description: string;
  }>;
}

function getStore(): AnalyticsStore {
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

function saveStore(store: AnalyticsStore) {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing analytics store:", e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type } = body;
    const store = getStore();
    const now = new Date().toISOString();

    if (type === "visit") {
      const path = body.path || "/";
      store.visits.unshift({
        id: `v-${Date.now()}`,
        timestamp: now,
        path,
      });
      // Cap visits at 2000
      if (store.visits.length > 2000) {
        store.visits = store.visits.slice(0, 2000);
      }
      store.activities.unshift({
        id: `act-${Date.now()}`,
        timestamp: now,
        eventType: "visit",
        title: `Visitor on ${path}`,
        description: `Visitor accessed page ${path}`,
      });
    } else if (type === "check") {
      const agg = Number(body.aggregate) || 0;
      const stream = body.stream || "General";
      const count = Number(body.qualifiedCount) || 0;
      const email = body.email;

      store.checks.unshift({
        id: `chk-${Date.now()}`,
        timestamp: now,
        aggregate: agg,
        stream,
        qualifiedCount: count,
        studentEmail: email,
      });
      // Cap checks at 2000
      if (store.checks.length > 2000) {
        store.checks = store.checks.slice(0, 2000);
      }

      store.activities.unshift({
        id: `act-${Date.now()}`,
        timestamp: now,
        eventType: "check",
        title: `Grade Check Run (Aggregate ${agg})`,
        description: `Candidate checked ${stream} track — matched ${count} programmes.`,
      });
    }

    // Keep activities capped at 200
    if (store.activities.length > 200) {
      store.activities = store.activities.slice(0, 200);
    }

    saveStore(store);

    return NextResponse.json({ status: true });
  } catch (err: unknown) {
    console.error("Track error:", err);
    return NextResponse.json({ status: false }, { status: 500 });
  }
}
