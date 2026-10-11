import "./globals.css";

import { BlogPost } from "@/.generated/client";
import BlogsIntro from "@/components/blogs-intro";
import ContactSection from "@/components/contact-section";
import Experience from "@/components/experience";
import Footer from "@/components/footer";
import Intro from "@/components/intro";
import Opensource from "@/components/opensource";
import ProjectsIntro from "@/components/projects-intro";
import { Sidebar } from "@/components/sidebar";
import Skills from "@/components/skills";
import { getblogPost } from "@/lib/actions/blogs";
import { getWakatimeStats } from "@/lib/actions/wakatime";

export const revalidate = 600;

export default async function Home() {
  let latestPosts: BlogPost[] = [];

  const languages = await getWakatimeStats();
  try {
    latestPosts = await getblogPost("all", 4);
  } catch (error) {
    console.error("Failed to fetch latest posts:", error);
  }

  return (
    <>
      <div className="mx-auto grid max-w-6xl gap-x-24 px-6 md:px-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <Sidebar />

        <main className="pb-32 pt-10 lg:pt-24">
          <section id="intro" className="pb-16 pt-4 lg:pt-0">
            <Intro />
          </section>

          <section id="blogs" className="py-16">
            <BlogsIntro latestPosts={latestPosts} />
          </section>

          <Experience />
          <Opensource />
          <Skills languages={languages.languages || []} />
          <ProjectsIntro />
          <ContactSection />
        </main>
      </div>
      <Footer />
    </>
  );
}
