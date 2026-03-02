import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import { CustomError } from "./error";

type ValidateSchemas = {
  bodySchema?: z.ZodType;
  paramsSchema?: z.ZodType;
  querySchema?: z.ZodType;
};

export const validate = ({
  bodySchema,
  paramsSchema,
  querySchema,
}: ValidateSchemas) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (bodySchema) {
        bodySchema.parse(req.body); // safe parse does not throws an error
      }

      if (paramsSchema) {
        paramsSchema.parse(req.params);
      }

      if (querySchema) {
        querySchema.parse(req.query);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new CustomError(error.issues[0].message, 400));
      }
      next(error);
    }
  };
};
