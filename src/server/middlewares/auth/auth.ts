import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import CustomError from "../../../CustomError/CustomError.js";
import environment from "../../../loadEnvironment.js";
import type { CustomRequest, UserTokenPayload } from "../../../types";

const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.header("Authorization");

    if (!authorizationHeader) {
      const error = new CustomError(
        "Authorization header missing",
        401,
        "Missing token"
      );
      next(error);
      return;
    }

    if (!authorizationHeader.startsWith("Bearer ")) {
      const error = new CustomError(
        "Missing bearer in Authorization header",
        401,
        "Missing token"
      );

      next(error);
    }

    const token = authorizationHeader.replace(/^Bearer\s*/, "");

    const user = jwt.verify(token, environment.jwtSecret) as UserTokenPayload;

    req.userId = user.id;

    next();
  } catch (error: unknown) {
    const tokenError = new CustomError(
      (error as Error).message,
      401,
      "Invalid token"
    );
    next(tokenError);
  }
};

export default auth;
