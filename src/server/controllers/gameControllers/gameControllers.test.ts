import type { NextFunction, Request, Response } from "express";
import Game from "../../../database/models/Game";
import { getAllGames } from "./gameControllers";

const req: Partial<Request> = {
  params: {},
};

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

const gameList = [
  {
    players: [
      {
        userId: "637f7cb25d194a522132e02d",
        rol: "owner",
        material: ["net"],
      },
    ],
    date: "2011-09-16T10:05:17.000Z",
    location: {
      type: "Point",
      coordinates: [41.393832352040285, 2.2061303160935806],
      id: "6381eb3a9a8249a7937fa97f",
    },
    level: 2,
    gender: "female",
    format: "2x2",
    spots: 6,
    description: "test game",
    id: "6381e5ebf5cf836c397d4d82",
  },
];

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
