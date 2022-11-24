import CustomError from "./CustomError.js";

export const registerUserErrors = {
  userAlreadyRegistered: new CustomError(
    "Duplicate key",
    409,
    "User is already registered"
  ),
};

export const loginUserErrors = {
  userNotFound: new CustomError("Username not found", 401, "Wrong credentials"),

  incorrectPassword: new CustomError(
    "Incorrect password",
    401,
    "Wrong credentials"
  ),
};

export const authErrors = {
  noTokenProvided: new CustomError("Token is missing", 401, "Token is missing"),

  missingBearer: new CustomError("Missing Bearer in token", 401, "Bad token"),
};
