#!/usr/bin/env node
/**
 * Grant or revoke the `admin` custom claim that firestore.rules and
 * storage.rules check.
 *
 *   node scripts/set-admin.mjs <email-or-uid>
 *   node scripts/set-admin.mjs <email-or-uid> --revoke
 *
 * IMPORTANT: run this BEFORE deploying the rules. Until the claim exists, no
 * account can write, and the admin UI will show "You do not have permission to
 * make this change" on every save.
 *
 * The claim only appears in the client's token after the user signs out and in
 * again (or the token refreshes, within an hour).
 */
import { getAuth } from "firebase-admin/auth";
import { initAdmin } from "./lib/adminApp.mjs";

const [target, ...flags] = process.argv.slice(2);
const revoke = flags.includes("--revoke");

if (!target) {
  console.error("Usage: node scripts/set-admin.mjs <email-or-uid> [--revoke]");
  process.exit(1);
}

initAdmin();
const auth = getAuth();

const user = target.includes("@")
  ? await auth.getUserByEmail(target)
  : await auth.getUser(target);

const claims = { ...(user.customClaims ?? {}) };
if (revoke) delete claims.admin;
else claims.admin = true;

await auth.setCustomUserClaims(user.uid, claims);

console.log(
  `${revoke ? "Revoked" : "Granted"} admin for ${user.email ?? user.uid} (${user.uid})`
);
console.log(
  "The user must sign out and in again for the claim to take effect."
);
