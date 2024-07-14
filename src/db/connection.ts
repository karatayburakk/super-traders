import { Sequelize } from "sequelize-typescript";
import * as sequelize from "sequelize";
import { dbConfig } from "./config";

export let connection: Sequelize;

export function connect2Db(cb: () => void): void {
  connection = new Sequelize(dbConfig as any);

  connection
    .authenticate()
    .then((): void => {
      cb();
    })
    .catch((err: Error): void => {
      console.error(`DB Connection Error. Err: ${err.message}`);
      console.error("Exiting...");
      process.exit(-1);
    });
}
