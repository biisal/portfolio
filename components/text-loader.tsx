"use client";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export const TextLoader = () => {
  return (
    <motion.div
      className="text-xl font-bold  w-screen h-screen flex items-center justify-center overflow-hidden z-50 "
      style={{
        backgroundImage: "linear-gradient(45deg, #ff2764, #00d0ff)",
        backgroundSize: "300% 200%",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
      }}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 4,
        repeat: 3,
        ease: "easeInOut",
      }}
    >
      Loading...
    </motion.div>
  );
};
