import "./globals.css";

import About from "@/components/about";
import BlogPreview from "@/components/blog-preview";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import Intro from "@/components/intro";
import ProjectsIntro from "@/components/projects-intro";
import Skills from "@/components/skills";
import { getProjects } from "@/lib/actions/projects";
import { getWakatimeStats } from "@/lib/actions/wakatime";

export const revalidate = 600;

export default async function Home() {
  await getProjects();
  const wakatimeData = await getWakatimeStats();

  return (
    <>
      <div className="container mx-auto px-6 pb-28 lg:px-20">
        <Intro />
        <About />
        <ProjectsIntro />
        <Skills languages={wakatimeData.languages} />
        <BlogPreview />
        <ContactSection />
      </div>
      <Footer />
    </>
  );
}
