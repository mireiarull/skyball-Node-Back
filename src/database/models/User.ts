import type { InferSchemaType } from "mongoose";
import { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: {
    required: true,
    unique: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  name: {
    type: String,
  },
  gender: {
    type: String,
  },
  level: {
    type: Number,
  },
});

export type UserStructure = InferSchemaType<typeof userSchema>;

// eslint-disable-next-line @typescript-eslint/naming-convention
const User = model("User", userSchema, "users");

export default User;
