"use client";

import { useReportWebVitals } from "next/web-vitals";
import { useConsent } from "./Consent";

type Plausible = (
  event: string,
  opts?: { props?: Record<string, string | number> },
) => void;
declare global {
  interface Window {
    plausible?: Plausible;
  }
}

export function WebVitals() {
  const { choice } = useConsent();

  useReportWebVitals((metric) => {
    if (choice !== "accepted") return;
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      label: metric.label,
      path: window.location.pathname,
    });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/vitals", body);
    else fetch("/api/vitals", { method: "POST", body, keepalive: true });

    if (typeof window.plausible === "function") {
      window.plausible("Web Vitals", {
        props: {
          metric: metric.name,
          value: Math.round(metric.value),
          rating: metric.rating ?? "",
        },
      });
    }
  });

  return null;
}
