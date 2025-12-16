import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export class CustomError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const error = (
  err: CustomError & ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message =
    err?.issues[0]?.message || err.message || "Internal Server Error";
  return res.status(statusCode).json({ success: false, message });
};
