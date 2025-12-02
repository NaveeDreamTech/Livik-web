// lib/prisma.js
import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    log: ["error"],
  });
} else {
  // attach to globalThis so hot-reloads don't create many clients
  if (!globalThis.__prisma) {
    globalThis.__prisma = new PrismaClient({
      log: ["query", "info", "warn", "error"],
    });
  }
  prisma = globalThis.__prisma;
}

// Optional: attempt initial connect in dev to surface errors early
if (process.env.NODE_ENV !== "production") {
  prisma
    .$connect()
    .then(() => {
      // eslint-disable-next-line no-console
      console.log("[prisma] connected");
    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.warn("[prisma] initial connect failed:", e?.message ?? e);
    });
}

export { prisma };
