"use client";

import ContactForm from "./contact-form";
import SocialLinks from "./social-links";
import { BlurFade } from "./ui/blur-fade";

const ContactSection = () => {
  return (
    <section id="contact" className="relative flex w-full items-center py-24">
      <div className="w-full">
        <BlurFade delay={0.1} inView>
          <div className="mb-10 flex max-w-3xl flex-col gap-4">
            <p className="text-sm font-medium uppercase tracking-widest text-blog-orange">
              Get In Touch
            </p>
            <h2 className="text-3xl font-bold leading-tight text-blog-white md:text-5xl">
              Let&apos;s work together
            </h2>
            <p className="max-w-2xl text-base leading-7 text-blog-fg/65 md:text-lg">
              Have a product, system, or backend-heavy build in mind? Send the
              details and I’ll get back with a practical next step.
            </p>
          </div>
        </BlurFade>

        <div className="flex flex-col gap-3 mt-8">
          <BlurFade delay={0.2} inView>
            <SocialLinks />
          </BlurFade>
          <BlurFade delay={0.3} inView>
            <ContactForm />
          </BlurFade>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
