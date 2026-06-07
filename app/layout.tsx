import "./globals.css";

import { Metadata } from "next";
import { ThemeProvider } from "next-themes";

import Dock from "@/components/dock";
import GlobalBackground from "@/components/global-background";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { JetBrainsMono } from "@/fonts";
import { cn } from "@/lib/utils";

const heroImgUrl =
  "https://res.cloudinary.com/dorxspa9g/image/upload/v1780802824/blog-content/gtz7sxohubbtnrbjx6be.png";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Avisek Ray (biisal) | Full-Stack Developer Portfolio",
  icons: {
    icon: heroImgUrl,
  },
  description:
    "Avisek Ray (biisal) is a full-stack developer from India specializing in backend development with Python and Go, and frontend development with Next.js, React, and Svelte.",
  keywords: [
    "biisal",
    "Avisek Ray",
    "Full Stack Developer",
    "Web Developer",
    "Next.js Developer",
    "React Developer",
    "Django Developer",
    "FastAPI Developer",
    "Go Developer",
    "Software Engineer",
    "Portfolio",
    "AWS",
    "Docker",
    "PostgreSQL",
    "Redis",
  ],
  authors: [{ name: "Avisek Ray", url: "https://codeltix.com" }],
  openGraph: {
    title: "Avisek Ray (biisal) | Full-Stack Developer Portfolio",
    description:
      "Portfolio of Avisek Ray (biisal), a full-stack developer skilled in Python, Go, React, and modern cloud infrastructure. Explore projects built with Next.js, Django, FastAPI, and Docker.",
    url: "https://codeltix.com",
    siteName: "Avisek Ray Portfolio",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: heroImgUrl,
        width: 800,
        height: 600,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Avisek Ray (biisal) | Full-Stack Developer Portfolio",
    description:
      "Full-stack developer skilled in backend (Python, Go), frontend (React, Next.js), and DevOps (Docker, AWS).",
    creator: "@avisekray",
    images: [heroImgUrl],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("text-white", JetBrainsMono.className)}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <GlobalBackground />
          <Navbar />
          <Dock />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
