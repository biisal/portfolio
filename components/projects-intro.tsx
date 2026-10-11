import { BlogPost } from "@/.generated/client";
import { PostRow } from "@/components/post-row";
import { SectionHeading } from "@/components/section-heading";
import { getblogPost } from "@/lib/actions/blogs";

import { BlurFade } from "./ui/blur-fade";

const ProjectsIntro = async () => {
  let projects: BlogPost[] = [];
  try {
    projects = await getblogPost("project", 4);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
  }

  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className="py-16">
      <SectionHeading
        index="05"
        label="work"
        title="Selected work"
        description="A smaller set of things worth opening after the writing."
        href="/projects"
        className="mb-8"
      />

      <BlurFade delay={0.2} inView>
        <div className="divide-y divide-border border-y border-border">
          {projects.map((post) => (
            <PostRow key={post.id} post={post} />
          ))}
        </div>
      </BlurFade>
    </section>
  );
};

export default ProjectsIntro;
