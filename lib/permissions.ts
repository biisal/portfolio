import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  blog: ["read", "create", "share", "update", "delete"],
  project: ["read", "create", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
  blog: ["share"],
  project: ["read"],
});

export const admin = ac.newRole({
  blog: ["read", "create", "share", "update", "delete"],
  project: ["read", "create", "update", "delete"],
});
