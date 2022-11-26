import "../../../loadEnvironment";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import request from "supertest";
import type {
  Credentials,
  RegisterCredentials,
} from "../../controllers/userControllers/types";
import User from "../../../database/models/User";
import connectDatabase from "../../../database/connectDb";
import app from "../../app";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());
});

beforeEach(async () => {
  await User.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.stop();
});

// Describe("Given a GET method with /games/list endpoint", () => {
//   const registerData: RegisterCredentials = {
//     password: "123456",
//     email: "mireia@gmail.com",
//     name: "mireia",
//     gender: "f",
//     level: 2,
//   };

//   describe("When it receives a request password '123456' and email 'mireia@gmail.com'", () => {
//     test("Then it should respond with a 201 status and the email 'mireia@gmail.com' and id", async () => {
//       const expectedStatus = 201;

//       const response = await request(app)
//         .post("/users/register")
//         .send(registerData)
//         .expect(expectedStatus);

//       const newUser = await User.findOne({ email: registerData.email });

//       expect(response.body).toHaveProperty("email", registerData.email);
//       expect(response.body).toHaveProperty("id", newUser.id);
//     });
//   });
