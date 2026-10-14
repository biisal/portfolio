import { SectionHeading } from "@/components/section-heading";
import { BlurFade } from "@/components/ui/blur-fade";
import { experience } from "@/lib/experience";

const Experience = () => {
  if (experience.length === 0) return null;

  return (
    <section id="experience" className="py-16">
      <SectionHeading
        index="02"
        label="experience"
        title="Where I've worked"
        className="mb-8"
      />

      <BlurFade delay={0.2} inView>
        <ol className="divide-y divide-border border-y border-border">
          {experience.map((item) => (
            <li
              key={`${item.company}-${item.role}`}
              className="grid gap-1 py-6 "
            >
              <span className="pt-1 font-mono text-xs text-blog-fg">
                {item.period}
              </span>
              <div className="min-w-0">
                <h3 className="text-lg font-medium leading-snug tracking-tight text-blog-white md:text-xl">
                  {item.role}
                  <span className="text-blog-fg">
                    {" · "}
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline-offset-4 transition-colors hover:text-blog-white hover:underline"
                      >
                        {item.company}
                      </a>
                    ) : (
                      item.company
                    )}
                  </span>
                </h3>

                <p className="mt-1.5 text-sm leading-relaxed text-blog-fg">
                  {item.summary}
                </p>

                {item.highlights && item.highlights.length > 0 ? (
                  <ul className="mt-3 flex flex-col gap-1.5 text-sm leading-relaxed text-blog-fg">
                    {item.highlights.map((highlight) => (
                      <li key={highlight} className="flex gap-3">
                        <span aria-hidden className="text-blog-fg/60">
                          -
                        </span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {item.stack && item.stack.length > 0 ? (
                  <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-blog-fg/70">
                    {item.stack.map((tool) => (
                      <li key={tool}>{tool}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </BlurFade>
    </section>
  );
};

export default Experience;
