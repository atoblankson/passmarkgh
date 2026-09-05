export interface AdminMetricSummary {
  visits: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    trendVsLastPeriodPct: number;
  };
  checksRun: {
    total: number;
    today: number;
    thisWeek: number;
  };
  conversions: {
    total: number;
    today: number;
    thisWeek: number;
  };
  conversionRatePct: number;
  revenue: {
    totalGhc: number;
    todayGhc: number;
    thisWeekGhc: number;
    averagePerDayGhc: number;
  };
}

export interface TrendPoint {
  date: string; // e.g. "Aug 29", "Today"
  fullDate: string; // "2026-08-29"
  visits: number;
  checks: number;
  conversions: number;
  revenueGhc: number;
}

export interface AdminTransaction {
  id: string;
  date: string;
  timestamp: string;
  studentEmailOrPhone: string;
  amountGhc: number;
  reference: string;
  status: "success" | "failed";
  channel: "mobile_money" | "card";
  stream?: string;
}

export interface AdminActivity {
  id: string;
  timestamp: string;
  relativeTime: string;
  eventType: "visit" | "check" | "payment";
  title: string;
  description: string;
  metadata?: Record<string, unknown>;
}

// Default zero state for admin metrics when loading or if offline
export function getMockAdminData(): {
  summary: AdminMetricSummary;
  trends: TrendPoint[];
  transactions: AdminTransaction[];
  activities: AdminActivity[];
} {
  const trends: TrendPoint[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    trends.push({
      date: i === 0 ? "Today" : d.toLocaleDateString("en-GB", { month: "short", day: "numeric" }),
      fullDate: d.toISOString().slice(0, 10),
      visits: 0,
      checks: 0,
      conversions: 0,
      revenueGhc: 0,
    });
  }

  const summary: AdminMetricSummary = {
    visits: {
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      trendVsLastPeriodPct: 0,
    },
    checksRun: {
      total: 0,
      today: 0,
      thisWeek: 0,
    },
    conversions: {
      total: 0,
      today: 0,
      thisWeek: 0,
    },
    conversionRatePct: 0,
    revenue: {
      totalGhc: 0,
      todayGhc: 0,
      thisWeekGhc: 0,
      averagePerDayGhc: 0,
    },
  };

  return {
    summary,
    trends,
    transactions: [],
    activities: [],
  };
}


