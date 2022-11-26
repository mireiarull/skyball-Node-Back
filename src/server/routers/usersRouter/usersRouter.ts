import express from "express";
import { validate } from "express-validation";
import {
  userLoginSchema,
  userRegisterSchema,
} from "../../controllers/schemas/userCredentialsSchema.js";
import {
  loginUser,
  registerUser,
} from "../../controllers/userControllers/userControllers.js";
import routes from "../routes.js";

// eslint-disable-next-line new-cap
const userRouter = express.Router();

userRouter.post(
  routes.registerRoute,
  validate(userRegisterSchema, {}, { abortEarly: false }),
  registerUser
);

userRouter.post(
  routes.loginRoute,
  validate(userLoginSchema, {}, { abortEarly: false }),
  loginUser
);

export default userRouter;
