import { redirect } from "next/navigation";

export const metadata = {
  title: "Contact | Avisek Ray (biisal)",
  description:
    "Get in touch with Avisek Ray (biisal), a full-stack developer specializing in Python, Go, React, and modern web technologies. Let’s discuss projects, collaborations, or opportunities.",
  openGraph: {
    title: "Contact | Avisek Ray (biisal)",
    description:
      "Reach out to Avisek Ray (biisal), a full-stack developer experienced in backend and frontend development with modern frameworks and tools.",
    url: "https://codeltix.com/contact",
    siteName: "Avisek Ray Portfolio",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Avisek Ray (biisal)",
    description:
      "Contact Avisek Ray (biisal), full-stack developer skilled in Python, Go, React, and cloud technologies.",
    creator: "@avisekray",
  },
};

async function Contact() {
  redirect("/#contact");
}
export default Contact;
