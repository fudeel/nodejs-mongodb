import sanitize from 'mongo-sanitize';
import {Request, Response} from "express";

export const cleanBody = (req: Request, res: Response, next: () => void) => {
  try {
    req.body = sanitize(req.body);
    next();
  } catch (error) {

    return res.status(500).json({
      error: true,
      message: "Could not sanitize body",
    });
  }
};
