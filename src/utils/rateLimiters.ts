import { Request } from "express";
import { ipKeyGenerator, rateLimit } from "express-rate-limit";

export const limiter = (
  message: string,
  windowMs: number = 24 * 60 * 60 * 1000,
  limit: number = 5
) =>
  rateLimit({
    windowMs,
    limit,
    keyGenerator: (req: Request) =>
      String(req.user?._id || (req.ip && ipKeyGenerator(req?.ip))),
    message: {
      success: false,
      message,
    },
  });
