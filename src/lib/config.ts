const phoneNumber = "+91 7029881540";
const cvUrl =
  "https://drive.google.com/file/d/1wcR-9LoLmYQQ3lh-m35V7NxV1AdURNda/view?usp=drive_link";
const email = "biisal.int@gmail.com";

const social = [
  {
    label: "GitHub",
    href: "https://github.com/biisal",
    icon: "/icons/github-dark.svg",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/biisal",
    icon: "/icons/linkedin.svg",
  },
  {
    label: "X",
    href: "https://x.com/biisal18",
    icon: "/icons/x-twitter.svg",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@biisal18/streams",
    icon: "/icons/youtube.svg",
  },
] as const;

export { cvUrl, email, phoneNumber, social };
