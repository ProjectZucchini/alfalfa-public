import { type NextFunction, type Request, type Response } from "express";

export function bufferToString(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.body instanceof Buffer) {
    req.body = req.body.toString();
  }

  next();
}
