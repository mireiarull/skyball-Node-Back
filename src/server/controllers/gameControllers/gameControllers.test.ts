import type { NextFunction, Request, Response } from "express";
import CustomError from "../../../CustomError/CustomError";
import Game from "../../../database/models/Game";
import {
  getRandomGame,
  getRandomGameList,
} from "../../../factories/gamesFactory";
import type { CustomRequest, GamesRequestWithId } from "../../../types";
import {
  addOneGame,
  deleteOneGame,
  getAllGames,
  getOneGame,
} from "./gameControllers";

const req: Partial<CustomRequest> = {
  userId: "1234",
  params: {},
};

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

afterEach(() => {
  jest.clearAllMocks();
});

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
      const newGame = { ...game };
      const expectedResponse = { ...newGame };

      req.body = newGame;

      Game.create = jest.fn().mockReturnValueOnce({
        ...newGame,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        toJSON: jest.fn().mockReturnValueOnce(newGame),
      });

      await addOneGame(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(expectedResponse);
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

describe("Given a getOneGame controller", () => {
  const newGame = getRandomGame() as GamesRequestWithId;
  const req: Partial<CustomRequest> = {
    params: { gameId: newGame._id },
  };

  describe("When it receives a request with a game id from an authorized user", () => {
    test("Then it should invoke its response's method status with 200 and json with the game", async () => {
      const expectedStatus = 200;

      Game.findById = jest.fn().mockReturnValue(newGame);

      await getOneGame(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(newGame);
    });
  });

  describe("When it receives a request and Game.findbyId rejects", () => {
    test("Then next should be invoked with an error", async () => {
      Game.findById = jest.fn().mockResolvedValue(undefined);

      await getOneGame(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      const newCustomError = new CustomError(
        "Game not found",
        404,
        "Game not found"
      );

      expect(next).toHaveBeenCalledWith(newCustomError);
    });
  });

  describe("When it receives a request with no id in the params", () => {
    test("Then it should call the next with a Custom Error", async () => {
      const req: Partial<CustomRequest> = {
        params: { gameId: "" },
      };

      Game.findById = jest.fn().mockRejectedValue(new Error(""));

      await getOneGame(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given a deleteOneGame controller", () => {
  const game = getRandomGame();

  describe("When it receives a request with a correct id that exists on the database and the user id matches", () => {
    test("Then it should call the response method status with a 200", async () => {
      const expectedStatus = 200;

      const params = {
        id: game._id,
      };

      req.params = params;
      req.userId = game.owner.toString();

      Game.findById = jest.fn().mockReturnValue(game);

      Game.findByIdAndDelete = jest.fn().mockReturnValue(game);

      await deleteOneGame(req as CustomRequest, res as Response, () => {});

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a request with a correct id and the user id doesnt't match", () => {
    test("Then it should call the response method status with a 500", async () => {
      const params = {
        id: game._id,
      };

      req.params = params;
      req.userId = "";

      const customError = new CustomError(
        "User not allowed",
        500,
        "User not allowed"
      );

      Game.findById = jest.fn().mockReturnValue(game);

      await deleteOneGame(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it receives a request with a id that doesn't exist on the database", () => {
    test("Then it should call next with status with a 404", async () => {
      Game.findByIdAndDelete = jest.fn().mockRejectedValueOnce(new Error(""));

      await deleteOneGame(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });
});
