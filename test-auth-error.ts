import { auth } from "./lib/auth";

async function run() {
  try {
    const res = await auth.api.userHasPermission({
      body: { permission: { blog: ["read"] } },
      headers: new Headers(),
    });
    console.log("Result:", res);
  } catch (e) {
    console.error("Caught error:", e);
  }
}
run();
