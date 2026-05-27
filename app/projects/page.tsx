import { Metadata } from "next";

import ProjectsIntro from "@/components/projects-intro";

export const metadata: Metadata = {
  title: "Projects | Avisek Ray (biisal)",
  description:
    "Explore a collection of my recent projects, ranging from web applications to backend services and cloud infrastructure.",
  openGraph: {
    title: "Projects | Avisek Ray (biisal)",
    description:
      "Explore a collection of my recent projects, ranging from web applications to backend services and cloud infrastructure.",
    url: "https://codeltix.com/projects",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Avisek Ray (biisal)",
    description:
      "Portfolio of projects built with Next.js, Go, Python, and more.",
  },
};

export const revalidate = 600;

export default async function ProjectsPage() {
  return (
    <div className="container mx-auto px-6 lg:px-20">
      <ProjectsIntro />
    </div>
  );
}
