import "./loadEnvironment.js";
import chalk from "chalk";
import debugCreator from "debug";
import { mongo } from "mongoose";
import startServer from "./server/index.js";
import app from "./server/app.js";
import environment from "./loadEnvironment.js";

// eslint-disable-next-line @typescript-eslint/naming-convention
const { MongoServerError } = mongo;

const debug = debugCreator("skyball: server: root");

try {
  await startServer(app, environment.port);
  debug(
    chalk.yellow(`Server listening on: http://localhost:${environment.port}`)
  );
} catch (error: unknown) {
  if (error instanceof MongoServerError) {
    debug(
      chalk.red(`Error connecting to the database ${(error as Error).message}`)
    );
  } else {
    debug(chalk.red(`Error starting the server ${(error as Error).message}`));
  }
}
