import express from "express";
import { validate } from "express-validation";
import { userRegisterSchema } from "../controllers/schemas/userCredentialsSchema";
import { registerUser } from "../controllers/userControllers";

// eslint-disable-next-line new-cap
const userRouter = express.Router();

userRouter.post(
  "/register",
  validate(userRegisterSchema, {}, { abortEarly: false }),
  registerUser
);

export default userRouter;
