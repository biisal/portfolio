import { PostRow } from "@/components/post-row";
import { SectionHeading } from "@/components/section-heading";
import { getPosts } from "@/lib/blogs";

import { BlurFade } from "./ui/blur-fade";

const ProjectsIntro = () => {
  const projects = getPosts("project", 4);

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="py-16">
      <SectionHeading
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
