import "../../../loadEnvironment";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import User from "../../../database/models/User";
import connectDatabase from "../../../database/connectDatabase";
import app from "../../app";
import { getRandomGameList } from "../../../factories/gamesFactory";
import Game from "../../../database/models/Game";

let server: MongoMemoryServer;
const games = getRandomGameList(3);

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());

  await Game.create(games);
});

beforeEach(async () => {
  await User.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.stop();
});

describe("Given a GET method with /games/list endpoint", () => {
  describe("When it receives a request and there are three games in the database", () => {
    test("Then it should respond with a 200 status and a list of three games", async () => {
      const expectedStatus = 200;

      const response = await request(app)
        .get("/games/list")
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("games");
      expect(response.body.games).toHaveLength(3);
    });
  });
});
