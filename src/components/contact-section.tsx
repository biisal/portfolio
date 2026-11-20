import { SectionHeading } from "./section-heading";
import SocialLinks from "./social-links";
import { BlurFade } from "./ui/blur-fade";

const ContactSection = () => {
  return (
    <section id="contact" className="relative flex w-full items-center pt-16">
      <div className="w-full">
        <SectionHeading
          title="Let's work together"
          description="Have a product, system, or backend-heavy build in mind? Reach out by email or on any of the links below and I’ll get back with a practical next step."
          className="mb-8"
        />

        <div className="flex flex-col gap-3 mt-8">
          <BlurFade delay={0.2} inView>
            <SocialLinks />
          </BlurFade>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
