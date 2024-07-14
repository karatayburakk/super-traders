import { Request, Response, NextFunction } from "express";
import * as crypto from "crypto";
import * as jsonwebtoken from "jsonwebtoken";

export const hashCode = crypto.randomBytes(32).toString("hex");

export interface RequestWithAuth extends Request {
  userId: null | number;
}

export function authMiddleware(): (
  req: Request,
  res: Response,
  next: NextFunction
) => void {
  return (req: RequestWithAuth, res: Response, next: NextFunction): void => {
    const accessToken =
      req.body.token || req.query.token || req.headers["x-access-token"];

    if (!accessToken) {
      req.userId = null;
    }

    jsonwebtoken.verify(
      accessToken,
      hashCode,
      function (
        err: jsonwebtoken.JsonWebTokenError,
        decoded: jsonwebtoken.JwtPayload
      ) {
        if (err) {
          req.userId = null;
          return res.status(404).json(err);
        }

        req.userId = Number(decoded);
        return next();
      }
    );
  };
}
