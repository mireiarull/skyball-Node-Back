import express from "express";
import morgan from "morgan";
import cors from "cors";
import corsOptions from "./cors/corsOptions.js";
import { generalError, notFoundError } from "./middlewares/errors/errors.js";

const app = express();

app.use(cors(corsOptions));

app.disable("x-powered-by");

app.use(morgan("dev"));

app.use(express.json());

app.use(notFoundError);
app.use(generalError);

export default app;
