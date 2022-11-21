import dotenv from "dotenv";

dotenv.config();

export const environment = {
  // eslint-disable-next-line no-implicit-coercion
  port: +process.env.PORT,
  mongoDbUrl: process.env.MONGODB_URL,
  mongoDbDebug: process.env.DEBUG,
  jwtSecret: process.env.JWT_SECRET,
};

export default environment;
