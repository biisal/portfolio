import { Link, useNavigate, useParams } from "react-router-dom";

import BlogPagination from "@/components/blog/blog-pagination";
import { BlogPreview } from "@/components/blog/blog-preview";
import { Comments } from "@/components/blog/comments";
import SocialShare from "@/components/blog/social-share";
import NotFound from "@/components/not-found";
import { Seo } from "@/components/seo";
import { getAdjacentPosts, getPost } from "@/lib/blogs";
import { getPreviousPath } from "@/lib/use-scroll-to-hash";

const FALLBACK_OG =
  "https://res.cloudinary.com/dorxspa9g/image/upload/v1760437739/green-stick_holso5.png";

export default function Post() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();

  const post = getPost(slug);

  if (!post) {
    return (
      <NotFound
        text="No such blog"
        backLink="/blog"
        backText="Back to All Blogs"
      />
    );
  }

  const { prevPost, nextPost } = getAdjacentPosts(post.slug);

  return (
    <div className="min-h-screen text-blog-fg">
      <div className="mx-auto post-theme box-border max-w-216 px-6 pt-16 pb-28 sm:pt-24 md:px-6 md:pt-24 md:pb-28">
        <Seo
          title={`${post.title} | Avisek Ray Blog`}
          description={post.excerpt}
          path={`/blog/${post.slug}`}
          image={post.coverImage || FALLBACK_OG}
          type="article"
        />
        <Link
          to="/blog"
          onClick={(e) => {
            // Came from the list: go back so its scroll position is restored.
            if (getPreviousPath() === "/blog") {
              e.preventDefault();
              navigate(-1);
            }
          }}
          className="text-(--post-accent) hover:underline mb-12 block text-[0.95rem]"
        >
          ← Back to All Blogs
        </Link>
        <article>
          <header className="mb-8">
            <div className="mb-5 text-[0.95rem] leading-[1.8] text-(--post-muted)">
              {new Date(post.created_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
            <h1 className="font-serif font-normal leading-[1.15] tracking-[-0.015em] text-(--post-text) text-[clamp(2.1rem,6vw,2.8rem)]">
              {post.title}
            </h1>
          </header>
          {post.coverImage && (
            <div className="mb-8 relative w-full aspect-2/1 rounded-lg overflow-hidden border border-blog-inactive-border">
              <img
                src={post.coverImage}
                className="w-full h-full object-cover"
                alt={post.title}
              />
              <div className="w-full h-full backdrop-blur-sm absolute inset-0" />

              <img
                src={post.coverImage}
                alt={post.title}
                className="absolute inset-0 mx-auto h-full w-auto object-cover"
              />
            </div>
          )}
          <BlogPreview post={post} />
          {post.title && post.excerpt && (
            <SocialShare title={post.title} excerpt={post.excerpt} />
          )}

          <BlogPagination prevPost={prevPost} nextPost={nextPost} />
          <Comments />
        </article>
      </div>
    </div>
  );
}
