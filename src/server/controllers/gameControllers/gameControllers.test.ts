import type { NextFunction, Request, Response } from "express";
import Game from "../../../database/models/Game";
import {
  getRandomGame,
  getRandomGameList,
} from "../../../factories/gamesFactory";
import type { CustomRequest } from "../../../types";
import { addOneGame, getAllGames } from "./gameControllers";

const req: Partial<CustomRequest> = {
  userId: "1234",
  params: {},
};

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

const gameList = getRandomGameList(2);
const game = getRandomGame();

describe("Given a getAllGames controller", () => {
  describe("When it receives a request", () => {
    test("Then it should invoke its response's method status with 200 and json with a list of games", async () => {
      const expectedStatus = 200;

      Game.find = jest.fn().mockResolvedValueOnce(gameList);

      await getAllGames(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ games: gameList });
    });
  });

  describe("When it receives a request and Game.find rejects", () => {
    test("Then next should be invoked with an error", async () => {
      const error = new Error();

      Game.find = jest.fn().mockRejectedValue(error);

      await getAllGames(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a addOneGame controller", () => {
  describe("When it receives a request", () => {
    test("Then it should invoke its response's method status with 201 and json with the created game", async () => {
      const expectedStatus = 201;
      const newGame = game;

      Game.create = jest.fn().mockResolvedValueOnce(newGame);

      await addOneGame(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When it receives a request and Game.create rejects", () => {
    test("Then next should be invoked with an error", async () => {
      const error = new Error();

      Game.create = jest.fn().mockRejectedValue(error);

      await addOneGame(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
