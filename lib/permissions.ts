import { createAccessControl } from "better-auth/plugins/access";

export const statement = {
  blog: ["read", "create", "share", "update", "delete"],
  project: ["read", "create", "update", "delete"],
  comment: ["read", "create", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
  blog: ["share"],
  project: ["read"],
  comment: ["read", "create"],
});

export const admin = ac.newRole({
  blog: ["create", "update", "delete"],
  project: ["create", "update", "delete"],
  comment: ["read", "create", "update", "delete"],
});
