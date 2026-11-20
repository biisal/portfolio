import BlogsIntro from "@/components/blogs-intro";
import ContactSection from "@/components/contact-section";
import Experience from "@/components/experience";
import Footer from "@/components/footer";
import Intro from "@/components/intro";
import Opensource from "@/components/opensource";
import ProjectsIntro from "@/components/projects-intro";
import { Sidebar } from "@/components/sidebar";
import Skills from "@/components/skills";
import type { BlogPost } from "@/lib/types";
import { useWakatimeLanguages } from "@/lib/wakatime";

export default function Home({
  latestPosts,
  projects,
}: {
  latestPosts: BlogPost[];
  projects: BlogPost[];
}) {
  const languages = useWakatimeLanguages();

  return (
    <>
      <div className="mx-auto grid max-w-6xl gap-x-24 px-6 md:px-10 lg:grid-cols-[16rem_minmax(0,1fr)] clean:block clean:max-w-(--clean-page)">
        <Sidebar />

        <main className="pb-32 pt-10 lg:pt-24 clean:pt-10">
          <section id="intro" className="pb-16 pt-4 lg:pt-0">
            <Intro />
          </section>

          <section id="blogs" className="py-16">
            <BlogsIntro latestPosts={latestPosts} />
          </section>

          <Experience />
          <Opensource />
          <Skills languages={languages} />
          <ProjectsIntro projects={projects} />
          <ContactSection />
        </main>
      </div>
      <Footer />
    </>
  );
}
