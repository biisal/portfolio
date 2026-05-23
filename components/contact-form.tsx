"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import api from "@/api";
import {
  formSchema as FormSchema,
  FormValues,
} from "@/lib/schema/contact-form.schema";

import { Button } from "./ui/button";

export default function ContactForm() {
  const [capchanums, setCapchanums] = React.useState<{
    num1: number | null;
    num2: number | null;
  }>({
    num1: null,
    num2: null,
  });

  // Generate captcha numbers only on client to avoid hydration mismatch
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCapchanums({
        num1: Math.floor(Math.random() * 10),
        num2: Math.floor(Math.random() * 10),
      });
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const [captcha, setCaptcha] = React.useState("");
  const [captchaErr, setCaptchaErr] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });

  const regenerateCaptcha = React.useCallback(() => {
    setCapchanums({
      num1: Math.floor(Math.random() * 10),
      num2: Math.floor(Math.random() * 10),
    });
    setCaptcha("");
  }, []);

  const onSubmit = async (data: FormValues) => {
    if (capchanums.num1 === null || capchanums.num2 === null) {
      return;
    }

    if (
      Number.isNaN(parseInt(captcha)) ||
      parseInt(captcha) !== capchanums.num1 + capchanums.num2
    ) {
      setCaptchaErr(true);
      setTimeout(() => {
        setCaptchaErr(false);
      }, 3000);
    } else {
      try {
        setLoading(true);
        const res = await api.post("/contact", data);
        if (res.status === 200) {
          regenerateCaptcha();
          reset();
          toast("Your message has been sent");
        } else {
          toast.error("Error sending message");
        }
      } catch (err) {
        console.error({ err });
        toast.error("Unable to send message! Try again");
      } finally {
        regenerateCaptcha();
        setLoading(false);
      }
    }
  };

  const inputClasses =
    "w-full rounded-lg border border-blog-selection-bg/50 bg-[#0d1020] px-4 py-3 text-blog-white placeholder:text-blog-fg/35 outline-none transition-colors duration-300 focus:border-blog-orange focus:bg-[#151a29]";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-blog-fg/65">Your Name</label>
        <input
          type="text"
          {...register("name")}
          className={inputClasses}
          placeholder="Your Name"
        />
        {errors.name && (
          <span className="text-red-400 text-xs">{errors.name.message}</span>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-blog-fg/65">Email</label>
          <input
            type="email"
            {...register("email")}
            className={inputClasses}
            placeholder="your@email.com"
          />
          {errors.email && (
            <span className="text-red-400 text-xs">{errors.email.message}</span>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-blog-fg/65">
            WhatsApp (Optional)
          </label>
          <input
            type="text"
            {...register("whatsapp")}
            className={inputClasses}
            placeholder="+91 1234567890"
          />
          {errors.whatsapp && (
            <span className="text-red-400 text-xs">
              {errors.whatsapp.message}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-blog-fg/65">Message</label>
        <textarea
          {...register("message")}
          className={`${inputClasses} resize-none min-h-[120px]`}
          placeholder="Tell me about your plan or requirements..."
          rows={4}
        />
        {errors.message && (
          <span className="text-red-400 text-xs">{errors.message.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-blog-selection-bg/50 bg-[#0d1020] p-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm text-blog-fg/65">
          Verify you&apos;re human
        </span>
        <div className="flex items-center gap-2">
          <motion.span
            key={`num1-${capchanums.num1}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded bg-blog-orange/12 px-3 py-1.5 font-mono font-bold text-blog-orange"
          >
            {capchanums.num1 ?? "?"}
          </motion.span>
          <span className="text-blog-fg/40">+</span>
          <motion.span
            key={`num2-${capchanums.num2}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded bg-blog-orange/12 px-3 py-1.5 font-mono font-bold text-blog-orange"
          >
            {capchanums.num2 ?? "?"}
          </motion.span>
          <span className="text-blog-fg/40">=</span>
          <input
            type="text"
            value={captcha}
            onChange={(e) => setCaptcha(e.target.value)}
            className="w-14 rounded border border-blog-selection-bg/50 bg-blog-bg px-3 py-1.5 text-center font-mono text-blog-white outline-none transition-colors focus:border-blog-orange"
            placeholder="?"
          />
        </div>
        {captchaErr && (
          <span className="text-red-400 text-xs animate-pulse">
            Incorrect answer
          </span>
        )}
      </div>

      <Button
        disabled={loading}
        type="submit"
        size="lg"
        className="group w-full rounded-lg bg-blog-orange px-8 py-6 font-medium text-blog-bg transition-all duration-300 hover:bg-blog-orange/90 sm:w-auto"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send Message
            <Send className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>
    </form>
  );
}
