import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "http";
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
        const status = 400;
        const statusText = STATUS_CODES[status] || "Bad Request";

        return res.status(status).json({
          statusCode: status,
          error: statusText,
          message: "Validation failed",
          path: req.originalUrl,
          method: req.method,
          timestamp: new Date().toISOString(),
          details: err.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        });
      }
      return next(err);
    }
  };
}


