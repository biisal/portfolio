import "./globals.css";

import { BlogPost } from "@/.generated/client";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import Intro from "@/components/intro";
import ProjectsIntro from "@/components/projects-intro";
import Skills from "@/components/skills";
import { getPublishedBlogPosts } from "@/lib/actions/blogs";
import { getWakatimeStats } from "@/lib/actions/wakatime";

export const revalidate = 600;

export default async function Home() {
  let latestPosts: BlogPost[] = [];

  const languages = await getWakatimeStats();
  try {
    latestPosts = (await getPublishedBlogPosts()).slice(0, 4);
  } catch (error) {
    console.error("Failed to fetch latest posts:", error);
  }

  return (
    <>
      <div className="pb-28 pt-8 px-8 md:px-20 md:pt-20">
        <div className="mx-auto max-w-4xl">
          <Intro latestPosts={latestPosts} />
          <Skills languages={languages.languages || []} />
          <ProjectsIntro />
          <ContactSection />
        </div>
      </div>
      <Footer />
    </>
  );
}
