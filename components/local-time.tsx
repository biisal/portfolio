"use client";

import { useEffect, useState } from "react";

const TIME_ZONE = "Asia/Kolkata";

const formatTime = () =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TIME_ZONE,
  }).format(new Date());

/** Live clock for the site owner's timezone. Renders a placeholder until mounted to avoid hydration mismatch. */
export const LocalTime = () => {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(formatTime());
    const id = setInterval(() => setTime(formatTime()), 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        aria-hidden
        className="size-1.5 rounded-full bg-signal motion-safe:animate-pulse"
      />
      <span className="text-blog-white">{time ?? "--:--"}</span>
      <span>IST</span>
    </span>
  );
};
