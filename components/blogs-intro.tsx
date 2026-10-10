"use client";

import { BlogPost } from "@/.generated/client";
import { PostRow } from "@/components/post-row";
import { SectionHeading } from "@/components/section-heading";
import { BlurFade } from "@/components/ui/blur-fade";

interface BlogsIntroProps {
  latestPosts: BlogPost[];
}

const BlogsIntro = ({ latestPosts }: BlogsIntroProps) => {
  return (
    <div>
      <SectionHeading
        index="01"
        label="writing"
        title="Latest posts"
        href="/blog"
        className="mb-8"
      />

      <BlurFade delay={0.2} inView>
        <div className="divide-y divide-border border-y border-border">
          {latestPosts.map((post) => (
            <PostRow key={post.id} post={post} />
          ))}
        </div>
      </BlurFade>
    </div>
  );
};

export default BlogsIntro;
