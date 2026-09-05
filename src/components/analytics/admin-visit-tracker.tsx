"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function AdminVisitTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);
  const lastTrackedTime = useRef<number>(0);

  useEffect(() => {
    if (!pathname) return;

    // Only run on local development environment
    if (
      typeof window !== "undefined" &&
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
    ) {
      return;
    }

    // Ignore admin and API paths from visit counts
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;

    const now = Date.now();
    // Throttle tracking the same page within 5 seconds
    if (lastTrackedPath.current === pathname && now - lastTrackedTime.current < 5000) {
      return;
    }

    lastTrackedPath.current = pathname;
    lastTrackedTime.current = now;

    fetch("/api/admin/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "visit",
        path: pathname,
      }),
    }).catch(() => {
      // Non-blocking
    });
  }, [pathname]);

  return null;
}
