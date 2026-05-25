import Image from "next/image";

import { cn } from "@/lib/utils";

interface ProjectSmallCardProps {
  img_url: string;
  title: string;
  excerpt: string;
  date?: string | Date;
  width_class?: string;
}

const ProjectSmallCard = ({
  img_url,
  title,
  width_class,
}: ProjectSmallCardProps) => {
  return (
    <div
      className={cn(
        "group relative aspect-video w-full overflow-hidden rounded-lg",
        "border border-blog-inactive-border bg-[#0d1020] transition-colors duration-300 ",
        width_class,
      )}
    >
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={img_url}
          alt={title}
          fill
          className="scale-110 object-cover opacity-25 blur-2xl transition-all duration-500 group-hover:opacity-35"
        />

        <Image
          src={img_url}
          alt={title}
          fill
          className="z-10 object-contain p-4 transition-transform duration-500"
        />
      </div>
    </div>
  );
};

export default ProjectSmallCard;
