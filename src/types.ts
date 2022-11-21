import type { JwtPayload } from "jsonwebtoken";

export interface UserTokenPayload extends JwtPayload {
  id: string;
  email: string;
}
