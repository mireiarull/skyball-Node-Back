import type { NextFunction, Request, Response } from "express";
import Game from "../../../database/models/Game";
import { getRandomGameList } from "../../../factories/gamesFactory";
import { getAllGames } from "./gameControllers";

const req: Partial<Request> = {
  params: {},
};

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

const gameList = getRandomGameList(2);

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
