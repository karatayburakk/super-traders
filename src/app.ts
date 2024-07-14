import * as http from "http";
import express from "express";
import { createDbIfNotExists } from "./db/creation";
import { connect2Db, connection } from "./db/connection";
import defineModels from "./db/models/__models";
import restApi from "./api/index";
import { initializeDatabaseWithData } from "./db/bulk";

const app = express();
let server: http.Server = null;
const PORT = 8082;

app.use(express.json());

createDbIfNotExists()
  .then((): void => {
    connect2Db((): void => {
      console.info("Connected to DB...");

      defineModels(connection, (err): void => {
        if (err) {
          console.error(`Define Models Error: ${err}`);
          process.exit(-1);
        }

        initializeDatabaseWithData();

        restApi(app);

        server = http.createServer(app);

        server.listen(PORT);

        server.on("error", (error: Error): void => {
          throw error;
        });
        server.on("listening", (): void => {
          console.info(
            "********** Server Listening on port " + PORT + " *********"
          );
        });
      });
    });
  })
  .catch((err) => {
    console.error(err);
  });
