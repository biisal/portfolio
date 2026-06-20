"use client";

import { Github } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function LoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
      });
    } catch (error) {
      console.error("Failed to login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogin}
      disabled={isLoading}
      className="flex items-center gap-2 bg-blog-black text-blog-white hover:bg-blog-black/80 border border-blog-inactive-border px-6 py-6 text-lg"
    >
      <Github className="w-5 h-5" />
      {isLoading ? "Signing in..." : "Continue with GitHub"}
    </Button>
  );
}
