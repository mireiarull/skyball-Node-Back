import "../../loadEnvironment";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import type { RegisterCredentials } from "../controllers/types";
import User from "../../database/models/User";
import connectDatabase from "../../database";
import app from "../app";

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

describe("Given a POST method with /users/register endpoint", () => {
  const registerData: RegisterCredentials = {
    password: "123456",
    email: "mireia@gmail.com",
    name: "mireia",
    gender: "f",
    level: 2,
  };

  describe("When it receives a request password '123456' and email 'mireia@gmail.com'", () => {
    test("Then it should respond with a 201 status and the email 'mireia@gmail.com' and id", async () => {
      const expectedStatus = 201;

      const response = await request(app)
        .post("/users/register")
        .send(registerData)
        .expect(expectedStatus);

      const newUser = await User.findOne({ email: registerData.email });

      expect(response.body).toHaveProperty("email", registerData.email);
      expect(response.body).toHaveProperty("id", newUser.id);
    });
  });

  describe("When it receives a request with email 'mireia@gmail.com' and this email already exists in the database ", () => {
    test("Then it should respond with a response status 409, and the message 'User already registered'", async () => {
      const expectedStatus = 409;

      await User.create(registerData);

      const response = await request(app)
        .post("/users/register")
        .send(registerData)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty(
        "error",
        "User is already registered"
      );
    });
  });

  describe("When it receives a request with email '1234' that doesn't follow the schema", () => {
    test("Then it should respond with a response status 500, and the message 'Wrong data'", async () => {
      const wrongRegisterData = {
        password: "123456",
        email: 1234,
        name: "mireia",
        gender: "f",
        level: 2,
      };
      const expectedStatus = 400;

      await User.create(wrongRegisterData);

      const response = await request(app)
        .post("/users/register")
        .send(wrongRegisterData)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", "Wrong data");
    });
  });
});
