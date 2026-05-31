import { adminClient } from "better-auth/client/plugins"; // ← client version
import { createAuthClient } from "better-auth/react";

import { ac, admin as adminRole, user } from "./permissions";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  plugins: [
    adminClient({
      defaultRole: "user",
      ac: ac,
      roles: {
        user,
        admin: adminRole,
      },
    }),
  ],
});
