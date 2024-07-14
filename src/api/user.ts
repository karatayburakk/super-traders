import * as express from "express";
import { Request, Response, NextFunction } from "express";
import * as bcrypt from "bcryptjs";
import * as jsonwebtoken from "jsonwebtoken";
import User from "../db/models/user";
import { hashCode } from "./auth-middleware";

export default function api(): express.Router {
  const router: express.Router = express.Router();

  router.post("/signUp", signUp);
  router.post("/logIn", logIn);

  return router;
}

function signUp(req: Request, res: Response, _next: NextFunction) {
  User.create(req.body)
    .then((user: User) => {
      return res.status(201).json("OK");
    })
    .catch((err: Error) => {
      return res.status(404).json(err);
    });
}

function logIn(req: Request, res: Response, _next: NextFunction) {
  User.findOne({
    where: {
      username: req.body.username,
    },
    attributes: { include: ["password"] },
  })
    .then((user: User) => {
      if (!user)
        return res.status(404).json({
          name: "Invalid username or password",
        });
      bcrypt
        .compare(req.body.password, user.password)
        .then((isLoggedIn) => {
          if (!isLoggedIn)
            return res.status(404).json({
              name: "Invalid username or password",
            });

          const token = jsonwebtoken.sign(user.id, hashCode);

          return res.status(200).json({
            token,
          });
        })
        .catch((err) => {
          return res.status(404).json(err);
        });
    })
    .catch((err: Error) => {
      return res.status(404).json(err);
    });
}
