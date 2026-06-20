import { Metadata } from "next";

import { LoginButton } from "@/components/login-button";

export const metadata: Metadata = {
  title: "Login | Avisek Ray (biisal)",
  description: "Login to access admin features.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 text-blog-fg bg-blog-bg">
      <div className="max-w-md w-full flex flex-col items-center gap-8 border border-blog-inactive-border rounded-xl p-10 bg-blog-black/50">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-blog-orange">Welcome Back</h1>
          <p className="text-blog-fg/70">Sign in to manage your content</p>
        </div>

        <LoginButton />
      </div>
    </div>
  );
}
