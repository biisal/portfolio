"use client";
import { usePathname } from "next/navigation";
import React from "react";

const GlobalBackground = () => {
  const path = usePathname();

  if (path.startsWith("/project") || path.startsWith("/blog")) {
    return <div className="fixed inset-0 z-[-1] h-full w-full bg-blog-bg" />;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] h-full w-full overflow-hidden bg-blog-bg">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at top left,rgba(247,118,142,0.03),transparent 24%),radial-gradient(circle at 80% 10%,rgba(255,158,100,0.05),transparent 22%),linear-gradient(180deg,var(--blog-bg) 0%,var(--blog-bg) 100%)",
        }}
      />
    </div>
  );
};

export default GlobalBackground;
