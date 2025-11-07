"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
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
