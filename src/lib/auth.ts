import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { Pool } from "pg";

import {
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendMagicLinkEmail,
} from "./emails/send";

const githubId = process.env.GITHUB_CLIENT_ID;
const githubSecret = process.env.GITHUB_CLIENT_SECRET;
const googleId = process.env.GOOGLE_CLIENT_ID;
const googleSecret = process.env.GOOGLE_CLIENT_SECRET;

const socialProviders: Record<
  string,
  { clientId: string; clientSecret: string }
> = {};
if (githubId && githubSecret)
  socialProviders.github = { clientId: githubId, clientSecret: githubSecret };
if (googleId && googleSecret)
  socialProviders.google = { clientId: googleId, clientSecret: googleSecret };

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URI,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) =>
      sendResetPasswordEmail({ to: user.email, name: user.name, url }),
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) =>
      sendVerificationEmail({ to: user.email, name: user.name, url }),
  },
  ...(Object.keys(socialProviders).length ? { socialProviders } : {}),
  user: {
    additionalFields: {
      stripeCustomerId: { type: "string", required: false, input: false },
      subscriptionId: { type: "string", required: false, input: false },
      subscriptionStatus: { type: "string", required: false, input: false },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) =>
        sendMagicLinkEmail({ to: email, url }),
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;

export const enabledProviders = Object.keys(socialProviders) as Array<
  "github" | "google"
>;
