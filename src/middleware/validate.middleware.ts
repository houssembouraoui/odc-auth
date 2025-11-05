import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

type ValidateSchemas = {
  body?: ZodSchema<any>;
  query?: ZodSchema<any>;
  params?: ZodSchema<any>;
};

export function validate(schemas: ValidateSchemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        const parsed = schemas.body.parse(req.body);
        (req as any).validatedBody = parsed;
      }
      if (schemas.query) {
        const parsed = schemas.query.parse(req.query);
        (req as any).validatedQuery = parsed;
      }
      if (schemas.params) {
        const parsed = schemas.params.parse(req.params);
        (req as any).validatedParams = parsed;
      }
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: err.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        });
      }
      return next(err);
    }
  };
}


