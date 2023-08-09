import { type Request, type Response } from "express";

export function hello(req: Request, res: Response) {
  res.json({
    message: "Hello world!",
  });
}
