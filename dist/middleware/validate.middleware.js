"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const http_1 = require("http");
const zod_1 = require("zod");
function validate(schemas) {
    return (req, res, next) => {
        try {
            if (schemas.body) {
                const parsed = schemas.body.parse(req.body);
                req.validatedBody = parsed;
            }
            if (schemas.query) {
                const parsed = schemas.query.parse(req.query);
                req.validatedQuery = parsed;
            }
            if (schemas.params) {
                const parsed = schemas.params.parse(req.params);
                req.validatedParams = parsed;
            }
            return next();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                const status = 400;
                const statusText = http_1.STATUS_CODES[status] || "Bad Request";
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
