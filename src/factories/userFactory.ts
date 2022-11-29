import { Factory } from "fishery";
import { faker } from "@faker-js/faker";

import mongoose from "mongoose";
import type { RegisterCredentials } from "../server/controllers/userControllers/types";

const userFactory = Factory.define<RegisterCredentials>(() => ({
  password: faker.internet.password(),
  email: faker.internet.email(),
  name: faker.name.firstName(),
  gender: "M",
  level: faker.datatype.number(),
  _id: new mongoose.Types.ObjectId(),
}));

export const getRandomUser = () => userFactory.build();
