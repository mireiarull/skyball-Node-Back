import express from "express";
import { validate } from "express-validation";
import {
  userLoginSchema,
  userRegisterSchema,
} from "../controllers/schemas/userCredentialsSchema.js";
import { loginUser, registerUser } from "../controllers/userControllers.js";

// eslint-disable-next-line new-cap
const userRouter = express.Router();

userRouter.post(
  "/register",
  validate(userRegisterSchema, {}, { abortEarly: false }),
  registerUser
);

userRouter.post(
  "/login",
  validate(userLoginSchema, {}, { abortEarly: false }),
  loginUser
);

export default userRouter;
