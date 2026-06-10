import "./globals.css";

import { BlogPost } from "@/.generated/client";
import BlogsIntro from "@/components/blogs-intro";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import Intro from "@/components/intro";
import Opensource from "@/components/opensource";
import ProjectsIntro from "@/components/projects-intro";
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
      <div className="pb-28 pt-8 px-8 md:px-20 md:pt-20">
        <div className="mx-auto max-w-4xl">
          <section
            id="intro"
            className="relative flex min-h-screen w-full flex-col justify-center py-16 text-blog-fg md:py-20"
          >
            <div className="flex flex-col gap-16">
              <Intro />
              <div id="blogs">
                <BlogsIntro latestPosts={latestPosts} />
              </div>
            </div>
          </section>
          <Opensource />
          <Skills languages={languages.languages || []} />
          <ProjectsIntro />
          <ContactSection />
        </div>
      </div>
      <Footer />
    </>
  );
}
