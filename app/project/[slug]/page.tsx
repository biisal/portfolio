import { Metadata } from "next";
import { cache, Suspense } from "react";

import NotFound from "@/components/not-found";
import ProjectShow from "@/components/project-show";
import { TextLoader } from "@/components/text-loader";
import { prisma } from "@/lib/prisma";
import { ProjectInterface } from "@/lib/schema/project.schema";

export const revalidate = 600;

const getProject = cache(
  async (slug: string): Promise<ProjectInterface | null> => {
    try {
      return await prisma.project.findFirst({ where: { slug } });
    } catch (err) {
      console.log("Error fetching project:", err);
      return null;
    }
  },
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project)
    return {
      title: "Project Not Found | Avisek Ray (biisal)",
      description: "The project you are looking for was not found.",
    };

  const title = `${project.title} | Avisek Ray Projects`;
  const description = project.excerpt;
  const image = project.thumbnail;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://codeltix.com/project/${slug}`,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: project.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function Project({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project || !project.title) return <NotFound text="Project Not Found" />;
  return (
    <Suspense fallback={<TextLoader />}>
      {" "}
      <ProjectShow project={project} />{" "}
    </Suspense>
  );
}
