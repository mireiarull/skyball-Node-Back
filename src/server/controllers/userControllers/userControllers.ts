import environment from "../../../loadEnvironment.js";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { Error } from "mongoose";
import CustomError from "../../../CustomError/CustomError.js";
import User from "../../../database/models/User.js";
import type { Credentials, RegisterCredentials } from "./types.js";
import type { UserTokenPayload } from "../../../types.js";
import {
  loginUserErrors,
  registerUserErrors,
} from "../../../CustomError/errors.js";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, name, gender, level } =
    req.body as RegisterCredentials;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      gender,
      level,
    });

    res.status(201).json({ id: newUser._id, email, name, gender, level });
  } catch (error: unknown) {
    if ((error as Error).message.includes("duplicate")) {
      next(registerUserErrors.userAlreadyRegistered);

      return;
    }

    const customError = new CustomError(
      (error as Error).message,
      500,
      "Error saving user"
    );

    next(customError);
  }
};

export const loginUser = async (
  req: Request<Record<string, unknown>, Record<string, unknown>, Credentials>,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    next(loginUserErrors.userNotFound);
    return;
  }

  if (!(await bcrypt.compare(password, user.password))) {
    next(loginUserErrors.incorrectPassword);
    return;
  }

  const tokenPayload: UserTokenPayload = {
    email,
    id: user._id.toString(),
  };

  const token = jwt.sign(tokenPayload, environment.jwtSecret);

  res.status(201).json({ token });
};
