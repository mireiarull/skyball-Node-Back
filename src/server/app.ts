import express from "express";
import morgan from "morgan";
import cors from "cors";
import { generalError, notFoundError } from "./middlewares/errors/errors.js";
import userRouter from "./routers/usersRouter.js";

const app = express();

app.use(cors());

app.disable("x-powered-by");

app.use(morgan("dev"));

app.use(express.json());

app.use("/user", userRouter);

app.use(notFoundError);
app.use(generalError);

export default app;
