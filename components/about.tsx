import { BlurFade } from "@/components/ui/blur-fade";

const About = () => {
  return (
    <section
      id="about"
      className="relative flex w-full flex-col justify-center py-24"
    >
      <div className="z-10 flex w-full flex-col gap-8">
        <BlurFade delay={0.2} inView>
          <h2 className="mb-2 text-4xl font-bold text-blog-white md:text-5xl">
            <span className="text-blog-orange">About</span> Me
          </h2>
        </BlurFade>

        <BlurFade delay={0.3} inView>
          <div className="flex max-w-3xl flex-col gap-4 text-base text-blog-fg/80 md:text-lg">
            <p>
              I’m Avisek from{" "}
              <span className="text-lg font-bold text-blog-white">
                West Bengal, India
              </span>
              . I’m pursuing a{" "}
              <span className="text-lg font-medium text-blog-white">
                BCA in Software Engineering
              </span>{" "}
              at Amity University.
            </p>
          </div>
        </BlurFade>

        <BlurFade delay={0.4} inView>
          <div className="flex max-w-3xl flex-row items-stretch rounded-r-xl py-2">
            <div className="w-1 self-stretch rounded-full bg-blog-orange"></div>
            <p className="py-1 pl-5 text-xl font-semibold leading-snug text-blog-white md:text-2xl">
              I like to make things that help people using my programming
              skills. Also, I’m a freelancer.
              <br />
              My goal is to keep learning, explore new technologies, and
              contribute to projects that make a real difference.
            </p>
          </div>
          <p className="pt-2 text-xs text-blog-fg/55">
            Shipping, learning, and writing in public.
          </p>
        </BlurFade>
      </div>
    </section>
  );
};

export default About;
