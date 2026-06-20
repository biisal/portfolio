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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(247,118,142,0.03),transparent_24%),radial-gradient(circle_at_80%_10%,rgba(255,158,100,0.05),transparent_22%),linear-gradient(180deg,#090b17_0%,#090b17_100%)]" />
    </div>
  );
};

export default GlobalBackground;
