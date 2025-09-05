import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

/**
 * Middleware to validate query parameters for GET requests
 * This is specifically designed for query parameter validation
 */
export const validateQuery =
  (zodSchema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = await zodSchema.parseAsync(req.query);
      next();
    } catch (error) {
      next(error);
    }
  };
