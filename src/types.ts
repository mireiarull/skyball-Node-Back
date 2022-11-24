import type { JwtPayload } from "jsonwebtoken";
import type { Request } from "express";

export interface CustomRequest extends Request {
  userId: string;
}
export interface UserTokenPayload extends JwtPayload {
  id: string;
  email: string;
}
