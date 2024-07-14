import { Sequelize } from "sequelize-typescript";
import Portfolio from "./portfolio";
import Share from "./share";
import SharePortfolio from "./share-in-portfolio";
import User from "./user";

export default function defineModels(
  dbConnection: Sequelize,
  cb: (err?: Error) => void
): void {
  dbConnection.addModels([User, Portfolio, Share, SharePortfolio]);
  dbConnection
    .sync({ force: true })
    .then((): void => {
      return cb();
    })
    .catch((e: Error): void => {
      return cb(e);
    });
}
