import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

const validateRequest = <T extends ZodObject>({
  bodySchema,
  paramsSchema,
  querySchema,
}: {
  bodySchema?: T;
  paramsSchema?: T;
  querySchema?: T;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (bodySchema) {
        bodySchema.safeParse(req.body);
      }

      if (paramsSchema) {
        paramsSchema.safeParse(req.body);
      }

      if (querySchema) {
        querySchema.safeParse(req.body);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;
