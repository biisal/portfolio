import { Github, MapPin } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center w-screen bg-black gap-4">
      <h1 className="text-xl font-thin text-white">Thank you :) (Laal dil)</h1>
      <p className="text-sm inline-flex items-center gap-2 text-white/50">
        <MapPin className="w-4 h-4 text-white/50" />
        West Bengal, India
      </p>
      <Link
        href="https://github.com/biisal/portfolio"
        target="_blank"
        className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
      >
        <Github className="w-4 h-4" />
        <span>Source Code</span>
      </Link>
    </div>
  );
};

export default Footer;
