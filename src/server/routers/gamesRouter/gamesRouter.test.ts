import "../../../loadEnvironment";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import User from "../../../database/models/User";
import connectDatabase from "../../../database/connectDatabase";
import app from "../../app";
import jwt from "jsonwebtoken";
import { getRandomGameList } from "../../../factories/gamesFactory";
import Game from "../../../database/models/Game";
import environment from "../../../loadEnvironment";
import { getRandomUser } from "../../../factories/userFactory";
import type { GameStructureWithId } from "../../controllers/gameControllers/types";

let server: MongoMemoryServer;
const games = getRandomGameList(3);

const user = getRandomUser();
const requestUserToken = jwt.sign(
  { email: user.email, id: user._id.toString() },
  environment.jwtSecret
);

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());
  await User.create(user);
});

afterEach(async () => {
  await Game.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.disconnect();
  await server.stop();
});

describe("Given a GET method with /games/list endpoint", () => {
  describe("When it receives a request and there are three games in the database", () => {
    test("Then it should respond with a 200 status and a list of three games", async () => {
      const expectedStatus = 200;

      await Game.create(games);

      const response = await request(app)
        .get("/games/list")
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("games");
      expect(response.body.games).toHaveLength(3);
    });
  });
});

describe("Given a GET method with /games/12345 endpoint", () => {
  describe("When it receives a request with a game id and it exists in the database", () => {
    test("Then it should respond with a 200 status and the game", async () => {
      const expectedStatus = 200;
      const newGame: GameStructureWithId = games[0];

      await Game.create(games);

      const response = await request(app)
        .get(`/games/${newGame._id}`)
        .set("Authorization", `Bearer ${requestUserToken}`)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("id", newGame._id);
    });
  });
});
