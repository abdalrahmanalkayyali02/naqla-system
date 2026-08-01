// src/common/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { twoFactor } from "better-auth/plugins";
import { PrismaClient } from "generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const adapterPg = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient({ adapter: adapterPg });

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // Map Better Auth's built-in 'name' field → our 'username' column (NOT NULL UNIQUE)
  user: {
    fields: {
      name: "username",
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  plugins: [
    twoFactor({
      issuer: "Naqla Chess",
    }),
  ],
});