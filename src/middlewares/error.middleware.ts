import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/response";

export default function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  // mongoose validation error
  if (err && err.name === "ValidationError") {
    return res.status(400).json(errorResponse("Validation failed", err));
  }

  // duplicate key error (unique index e.g. isbn)
  if (err && err.code === 11000) {
    return res.status(400).json(errorResponse("Duplicate key error", err));
  }

  // invalid id
  if (err && err.name === "CastError") {
    return res.status(400).json(errorResponse("Invalid ID", err.message));
  }

  console.error(err);
  return res.status(500).json(errorResponse("Internal server error", err?.message || err));
}
