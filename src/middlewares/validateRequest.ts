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
        bodySchema.parse(req.body);
      }

      if (paramsSchema) {
        paramsSchema.parse(req.body);
      }

      if (querySchema) {
        querySchema.parse(req.body);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;
