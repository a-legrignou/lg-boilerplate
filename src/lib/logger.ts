import pino from "pino";

const isProd = process.env.NODE_ENV === "production";
const isEdgeOrBrowser =
  typeof window !== "undefined" || process.env.NEXT_RUNTIME === "edge";

/**
 * Structured JSON logs in prod, pretty in dev.
 * Falls back to console in edge runtime / browser (pino transports require Node).
 */
export const logger = isEdgeOrBrowser
  ? (console as unknown as pino.Logger)
  : pino({
      level: process.env.LOG_LEVEL || (isProd ? "info" : "debug"),
      ...(isProd
        ? {}
        : {
            transport: {
              target: "pino-pretty",
              options: {
                colorize: true,
                translateTime: "HH:MM:ss",
                ignore: "pid,hostname",
              },
            },
          }),
    });
