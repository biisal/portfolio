import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";

import { ac, admin as adminRole, user } from "./permissions";
import { prisma } from "./prisma";

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  plugins: [
    admin({
      defaultRole: "user",
      ac: ac,
      roles: {
        user,
        admin: adminRole,
      },
    }),
  ],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
});

export type Session = typeof auth.$Infer.Session;
