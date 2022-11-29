import type mongoose from "mongoose";
export interface Credentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends Credentials {
  name: string;
  gender: string;
  level: number;
  _id?: mongoose.Types.ObjectId;
}
