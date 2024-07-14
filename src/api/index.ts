import { Application } from "express";
import user from "./user";
import portfolio from "./portfolio";
import share from "./share";
import shareInPortfolio from "./share-in-portfolio";

export default function (app: Application): void {
  app.use("/user", user());
  app.use("/portfolio", portfolio());
  app.use("/share", share());
  app.use("/shareInPortfolio", shareInPortfolio());
}
