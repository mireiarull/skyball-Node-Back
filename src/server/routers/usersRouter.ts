import express from "express";
import { validate } from "express-validation";
import { userRegisterSchema } from "../controllers/schemas/userCredentialsSchema.js";
import { registerUser } from "../controllers/userControllers.js";

// eslint-disable-next-line new-cap
const userRouter = express.Router();

userRouter.post(
  "/register",
  validate(userRegisterSchema, {}, { abortEarly: false }),
  registerUser
);

export default userRouter;
