import { z } from "zod";

export const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name too long" }),
  whatsapp: z
    .string()
    .max(20, { message: "Phone number too long" })
    .refine((val) => !Number.isNaN(parseInt(val)), {
      message: "Invalid phone number",
    }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .max(100, { message: "Email too long" }),
  message: z.string().max(2000, { message: "Message too long" }).optional(),
});

export type FormValues = z.infer<typeof formSchema>;
