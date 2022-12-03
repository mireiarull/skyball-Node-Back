/* eslint-disable @typescript-eslint/restrict-template-expressions */
import "../../../loadEnvironment";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import User from "../../../database/models/User";
import connectDatabase from "../../../database/connectDatabase";
import app from "../../app";
import jwt from "jsonwebtoken";
import {
  getRandomGame,
  getRandomGameList,
} from "../../../factories/gamesFactory";
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
      expect(response.body.games.games).toHaveLength(3);
    });
  });
});

describe("Given a GET method with /games/id endpoint", () => {
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

  describe("When it receives a request with an invalid token", () => {
    test("Then it should respond with a 401 status and an error", async () => {
      const expectedStatus = 401;
      const newGame: GameStructureWithId = games[0];

      await Game.create(games);

      const response = await request(app)
        .get(`/games/${newGame._id}`)
        .set("Authorization", "Bearer ")
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("When it receives a request with valid token and there are 0 games matching the id in the database", () => {
    test("Then it should respond with a game and status 404", async () => {
      const expectedStatus = 404;
      const newGame: GameStructureWithId = games[0];

      const response = await request(app)
        .get(`/games/${newGame._id}`)
        .set("Authorization", `Bearer ${requestUserToken}`)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error");
    });
  });
});

describe("Given a DELETE /games/delete/:gameId endpoint", () => {
  describe("When it receives a request from a logged user and a valid game id", () => {
    test("Then it should call the response method status with a 200", async () => {
      const expectedStatus = 200;

      const game = getRandomGame();

      const gameWithOwner = { ...game, owner: user._id };

      const newGame = await Game.create(gameWithOwner);

      await request(app)
        .delete(`/games/delete/${newGame._id}`)
        .set("Authorization", `Bearer ${requestUserToken}`)
        .set("Content-Type", "application/json")
        .expect(expectedStatus);
    });
  });

  describe("When it receives a request from a logged user with an invalid game id '123456'", () => {
    test("Then it should call the response method status with a 404 and an error", async () => {
      const expectedStatus = 404;
      const predictionId = "123456";

      const response = await request(app)
        .delete(`/games/delete/${predictionId}`)
        .set("Authorization", `Bearer ${requestUserToken}`)
        .set("Content-Type", "application/json")
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error");
    });
  });
});
