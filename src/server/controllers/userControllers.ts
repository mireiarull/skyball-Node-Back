import "../../loadEnvironment.js";
import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import type { Error } from "mongoose";
import CustomError from "../../CustomError/CustomError.js";
import User from "../../database/models/User.js";
import type { RegisterCredentials } from "./types.js";

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
      const customError = new CustomError(
        (error as Error).message,
        409,
        "User already registered"
      );

      next(customError);
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
