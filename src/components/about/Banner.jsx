// MarqueeEvents.jsx
import React, { useMemo } from "react";
import "./banner.css";

export default function Banner({ data }) {
  // Build a flat, sorted list from your object: { "2025-10-3": [ ... ], ... }
  const items = useMemo(() => {
    if (!data) return [];

    const flat = Object.entries(data).flatMap(([k, arr]) =>
      (arr || [])
        .map((ev) => {
          // Prefer isoDate, fall back to dateObj if needed
          const d = ev.isoDate
            ? new Date(ev.isoDate)
            : ev.dateObj
            ? new Date(ev.dateObj)
            : null;
          return d
            ? {
                date: d,
                dateKey: k,
                title: ev.title || "",
                location: ev.location || "",
              }
            : null;
        })
        .filter(Boolean)
    );

    // Sort ascending by date
    flat.sort((a, b) => a.date - b.date);

    // optional: only future (keep today and later)
    const now = Date.now();
    const future = flat.filter((x) => x.date.getTime() >= now - 60 * 1000);

    return future;
  }, [data]);

  if (!items.length) return null;

  // Format dates in UAE time (Asia/Dubai)
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dubai",
    month: "short",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // set true if you want 12h
  });

  // Example chunk: "Oct 03 (Dubai) — 10:30 — 4X4 off-road"
  const chunks = items.map((ev) => {
    const parts = fmt.formatToParts(ev.date);
    const wk = parts.find((p) => p.type === "weekday")?.value || "";
    const mo = parts.find((p) => p.type === "month")?.value || "";
    const da = parts.find((p) => p.type === "day")?.value || "";
    const hr = parts.find((p) => p.type === "hour")?.value || "";
    const mi = parts.find((p) => p.type === "minute")?.value || "";

    const dateStr = `${wk}, ${mo} ${da}`;
    const timeStr = `${hr}:${mi}`;
    const loc = ev.location ? `(${ev.location})` : "";
    const title = ev.title ? `— ${ev.title}` : "";

    // Tweak the phrasing however you like:
    return `${dateStr} ${loc} — ${timeStr} ${title}`;
  });

  // Build final sentence
  const sentence = `Exciting News! Upcoming Drive Event on : ${chunks.join(
    "   •   "
  )}`;

  return (
    <div className="marquee-bar" aria-live="polite" role="status">
      <div className="marquee-track">
        <span className="marquee-text">{sentence}</span>
        {/* duplicate for seamless loop */}
        <span className="marquee-text" aria-hidden="true">
          {sentence}
        </span>
      </div>
    </div>
  );
}
