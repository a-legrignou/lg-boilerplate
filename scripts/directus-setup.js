#!/usr/bin/env node
/**
 * scripts/directus-setup.js
 * ==========================
 * Bootstraps all Directus configuration required for the auth + premium
 * content system. Run once against a fresh or existing Directus 11 instance.
 *
 * Prerequisites:
 *   - Directus 11 running and accessible
 *   - An admin static token (or email/password) exported as env vars
 *
 * Usage:
 *   DIRECTUS_URL=https://admin.coreo-group.fr \
 *   DIRECTUS_ADMIN_TOKEN=your_admin_token \
 *   node scripts/directus-setup.js
 *
 * What it does (idempotent):
 *   1. Creates "Service Account" role with full permissions
 *   2. Creates the service account user + generates a static token
 *   3. Creates "Community" role (read community + public posts)
 *   4. Creates "Premium" role (read all posts)
 *   5. Adds `tier` field (select) to `posts` collection
 *   6. Adds `slug` field (string, unique) to `posts` collection
 *   7. Prints the generated service token — copy to DIRECTUS_STATIC_TOKEN
 */

const BASE = (process.env.DIRECTUS_URL || "").replace(/\/$/, "");
const TOKEN = process.env.DIRECTUS_ADMIN_TOKEN || "";

if (!BASE || !TOKEN) {
  console.error("❌  Set DIRECTUS_URL and DIRECTUS_ADMIN_TOKEN env vars.");
  process.exit(1);
}

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

async function api(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${JSON.stringify(json.errors ?? json)}`);
  return json.data ?? json;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function findOrCreate(listPath, createPath, matchFn, payload) {
  const items = await api("GET", listPath);
  const existing = Array.isArray(items) ? items.find(matchFn) : null;
  if (existing) {
    console.log(`  ✓ Already exists: ${payload.name ?? payload.field ?? JSON.stringify(payload)}`);
    return existing;
  }
  const created = await api("POST", createPath, payload);
  console.log(`  + Created: ${payload.name ?? payload.field ?? JSON.stringify(payload)}`);
  return created;
}

// ─── 1. Roles ─────────────────────────────────────────────────────────────────

async function setupRoles() {
  console.log("\n[1] Setting up roles…");

  const serviceRole = await findOrCreate(
    "/roles",
    "/roles",
    (r) => r.name === "Service Account",
    {
      name: "Service Account",
      description: "Internal service role — full API access. Never assign to human users.",
      admin_access: true,
      app_access: false,
    },
  );

  const communityRole = await findOrCreate(
    "/roles",
    "/roles",
    (r) => r.name === "Community",
    {
      name: "Community",
      description: "Registered users — access to public and community-tier articles.",
      admin_access: false,
      app_access: false,
    },
  );

  const premiumRole = await findOrCreate(
    "/roles",
    "/roles",
    (r) => r.name === "Premium",
    {
      name: "Premium",
      description: "Premium subscribers — full access to all articles and PDF exports.",
      admin_access: false,
      app_access: false,
    },
  );

  return { serviceRole, communityRole, premiumRole };
}

// ─── 2. Service account user + token ──────────────────────────────────────────

async function setupServiceAccount(serviceRoleId) {
  console.log("\n[2] Setting up service account user…");

  const users = await api("GET", "/users?filter[email][_eq]=service@coreo-internal.local");
  let serviceUser = Array.isArray(users) ? users[0] : null;

  if (!serviceUser) {
    serviceUser = await api("POST", "/users", {
      email: "service@coreo-internal.local",
      password: crypto.randomUUID(), // random — login not needed
      first_name: "Service",
      last_name: "Account",
      role: serviceRoleId,
      status: "active",
    });
    console.log("  + Service user created");
  } else {
    console.log("  ✓ Service user already exists");
  }

  // Generate a static token for the service account
  // In Directus 11, static tokens are set on the user record directly
  const staticToken = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");

  await api("PATCH", `/users/${serviceUser.id}`, { token: staticToken });
  console.log(`  + Static token generated (copy to DIRECTUS_STATIC_TOKEN):`);
  console.log(`\n  DIRECTUS_STATIC_TOKEN=${staticToken}\n`);

  return serviceUser;
}

// ─── 3. Posts collection fields ───────────────────────────────────────────────

async function setupPostsFields() {
  console.log("\n[3] Adding fields to `posts` collection…");

  // tier field
  const tiers = await api("GET", "/fields/posts");
  const hasTier = Array.isArray(tiers) && tiers.some((f) => f.field === "tier");

  if (!hasTier) {
    await api("POST", "/fields/posts", {
      field: "tier",
      type: "string",
      meta: {
        interface: "select-dropdown",
        options: {
          choices: [
            { text: "Public (tous)", value: null },
            { text: "Community", value: "community" },
            { text: "Premium", value: "premium" },
          ],
        },
        display: "labels",
        display_options: {
          choices: [
            { text: "Public", value: null, foreground: "#4a4540", background: "#f0ece4" },
            { text: "Community", value: "community", foreground: "#7a8f85", background: "rgba(122,143,133,0.14)" },
            { text: "Premium",   value: "premium",   foreground: "#c6a75c", background: "rgba(198,167,92,0.14)" },
          ],
        },
        note: "Niveau d'accès requis pour lire cet article.",
        width: "half",
      },
      schema: {
        is_nullable: true,
        default_value: null,
      },
    });
    console.log("  + Field `tier` created on posts");
  } else {
    console.log("  ✓ Field `tier` already exists on posts");
  }

  // slug field
  const hasSlug = Array.isArray(tiers) && tiers.some((f) => f.field === "slug");

  if (!hasSlug) {
    await api("POST", "/fields/posts", {
      field: "slug",
      type: "string",
      meta: {
        interface: "input",
        options: { slug: true, trim: true },
        note: "URL-friendly identifier — used in canonical URLs. Leave blank to use numeric ID.",
        width: "half",
      },
      schema: {
        is_nullable: true,
        is_unique: true,
        default_value: null,
      },
    });
    console.log("  + Field `slug` created on posts");
  } else {
    console.log("  ✓ Field `slug` already exists on posts");
  }
}

// ─── 4. Permissions ───────────────────────────────────────────────────────────

async function setupPermissions(communityRoleId, premiumRoleId) {
  console.log("\n[4] Setting up role permissions for `posts`…");

  // Community role: read posts where tier is null or "community"
  await api("POST", "/permissions", {
    role: communityRoleId,
    collection: "posts",
    action: "read",
    fields: ["*"],
    permissions: {
      _or: [
        { tier: { _null: true } },
        { tier: { _eq: "community" } },
      ],
    },
    validation: {},
  }).catch((e) => {
    if (e.message.includes("already")) return;
    console.warn("  ⚠ Community permission:", e.message);
  });
  console.log("  + Community: read posts (public + community)");

  // Premium role: read all posts
  await api("POST", "/permissions", {
    role: premiumRoleId,
    collection: "posts",
    action: "read",
    fields: ["*"],
    permissions: {},
    validation: {},
  }).catch((e) => {
    if (e.message.includes("already")) return;
    console.warn("  ⚠ Premium permission:", e.message);
  });
  console.log("  + Premium: read all posts");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🚀  Directus setup — ${BASE}`);

  try {
    const { serviceRole, communityRole, premiumRole } = await setupRoles();
    await setupServiceAccount(serviceRole.id);
    await setupPostsFields();
    await setupPermissions(communityRole.id, premiumRole.id);

    console.log("\n✅  Setup complete.\n");
    console.log("Next steps:");
    console.log("  1. Copy DIRECTUS_STATIC_TOKEN to your .env.local");
    console.log("  2. Assign the 'Community' or 'Premium' role to users in Directus admin");
    console.log("  3. Set tier on existing posts (null = public, community, premium)");
    console.log("  4. Optionally fill in the slug field for SEO-friendly URLs\n");
  } catch (err) {
    console.error("\n❌  Setup failed:", err.message);
    process.exit(1);
  }
}

main();
