import { dbConfig } from "./config";
import * as pg from "pg";

export function createDbIfNotExists(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject): void => {
    const client = new pg.Client({
      host: dbConfig.host,
      database: "postgres",
      user: dbConfig.username,
      password: dbConfig.password,
      port: dbConfig.port,
      connectionTimeoutMillis: 5000,
    });
    client
      .connect()
      .then((): void => {
        client
          .query('CREATE DATABASE "' + dbConfig.database + '"')
          .then((): void => {
            console.log("New Database Created");
            return resolve(true);
          })
          .catch((err: Error): void => {
            if (err.message.indexOf("already exists") >= 0)
              return resolve(true);
            console.error(
              `createDbIfNotExists: DB Create Error: ${err.message}`
            );
            return reject(err.message);
          });
      })
      .catch((err: Error): void => {
        console.error(`createDbIfNotExists: DB Connect Error: ${err.message}`);
        return reject(err.message);
      });
  });
}
