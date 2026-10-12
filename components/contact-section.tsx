"use client";

import ContactForm from "./contact-form";
import { SectionHeading } from "./section-heading";
import SocialLinks from "./social-links";
import { BlurFade } from "./ui/blur-fade";

const ContactSection = () => {
  return (
    <section id="contact" className="relative flex w-full items-center pt-16">
      <div className="w-full">
        <SectionHeading
          index="06"
          label="get in touch"
          title="Let's work together"
          description="Have a product, system, or backend-heavy build in mind? Send the details and I’ll get back with a practical next step."
          className="mb-8"
        />

        <div className="flex flex-col gap-3 mt-8">
          <BlurFade delay={0.2} inView>
            <SocialLinks />
          </BlurFade>
          <BlurFade delay={0.3} inView>
            <ContactForm />
          </BlurFade>
          <BlurFade delay={0.4} inView>
            <div className="mt-8 w-full flex justify-center">
              <img
                src="/shiba-lui.png"
                alt=""
                className="w-34 absolute right-0"
              />
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
