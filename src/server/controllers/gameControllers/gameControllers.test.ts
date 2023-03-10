import type { NextFunction, Request, Response } from "express";
import { DateTime } from "luxon";
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
  updateOneGame,
} from "./gameControllers";

const req: Partial<CustomRequest> = {
  userId: "1234",
  params: {},
  query: { page: "0" },
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
  describe("When it receives a request without a filter date in its params", () => {
    test("Then it should invoke its response's method status with 200 and json with a list of games", async () => {
      const expectedStatus = 200;

      Game.countDocuments = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockReturnValue(5) });

      Game.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              exec: jest.fn().mockReturnValue(gameList),
            }),
          }),
        }),
      });

      await getAllGames(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toBeCalledWith({
        games: {
          isNextPage: true,
          isPreviousPage: false,
          games: gameList,
          totalPages: 1,
        },
      });
    });
  });

  describe("When it receives a request without a filter date in its params and Game.find rejects", () => {
    test("Then next should be invoked with an error", async () => {
      Game.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              exec: jest.fn().mockReturnValue(null),
            }),
          }),
        }),
      });

      await getAllGames(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a request without a filter date in its params and there are no available games", () => {
    test("Then next should be invoked with an error", async () => {
      Game.countDocuments = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockReturnValue(0) });

      Game.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              exec: jest.fn().mockReturnValue([]),
            }),
          }),
        }),
      });

      await getAllGames(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a request with a filter date in its params ", () => {
    describe("And the date filter matches one game from the database", () => {
      const randomGameWithTime = { ...getRandomGame, dateTime: "2022-12-20" };
      const games = [...getRandomGameList(2), randomGameWithTime];

      const req: Partial<CustomRequest> = {
        userId: "1234",
        params: {},
        query: { page: "0", date: "2022-12-20" },
      };
      test("Then it should call the response method status with a 200 and the matching game", async () => {
        const expectedStatus = 200;

        req.params.date = games[2].dateTime;

        const expectedGame = games[2];

        Game.countDocuments = jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockReturnValue(3) });

        Game.find = jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                exec: jest.fn().mockReturnValue(expectedGame),
              }),
            }),
          }),
        });

        await getAllGames(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(res.status).toHaveBeenCalledWith(expectedStatus);
        expect(res.json).toBeCalledWith({
          games: {
            isNextPage: false,
            isPreviousPage: false,
            games: expectedGame,
            totalPages: NaN,
          },
        });
      });
    });

    describe("And the date filter matches one game from the database from today", () => {
      const today = DateTime.now().toString().slice(0, 10);
      const randomGameWithTime = {
        ...getRandomGame,
        dateTime: today,
      };
      const games = [...getRandomGameList(2), randomGameWithTime];

      const req: Partial<CustomRequest> = {
        userId: "1234",
        params: {},
        query: { page: "0", date: today },
      };
      test("Then it should call the response method status with a 200 and the matching game", async () => {
        const expectedStatus = 200;

        req.params.date = games[2].dateTime;

        const expectedGame = games[2];

        Game.countDocuments = jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockReturnValue(3) });

        Game.find = jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                exec: jest.fn().mockReturnValue(expectedGame),
              }),
            }),
          }),
        });

        await getAllGames(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        expect(res.status).toHaveBeenCalledWith(expectedStatus);
        expect(res.json).toBeCalledWith({
          games: {
            isNextPage: false,
            isPreviousPage: false,
            games: expectedGame,
            totalPages: NaN,
          },
        });
      });
    });

    describe("And the date filter doesn't matches any game from the database", () => {
      const randomGameWithTime = { ...getRandomGame, dateTime: "2022-12-20" };
      const games = [...getRandomGameList(2), randomGameWithTime];

      const req: Partial<CustomRequest> = {
        userId: "1234",
        params: {},
        query: { page: "0", date: "2022-12-20" },
      };
      test("Then it should call the response method status with a 200 and the matching game", async () => {
        req.params.date = games[2].dateTime;

        Game.countDocuments = jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockReturnValue(3) });

        Game.find = jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            skip: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                exec: jest.fn().mockReturnValue([]),
              }),
            }),
          }),
        });

        await getAllGames(
          req as CustomRequest,
          res as Response,
          next as NextFunction
        );

        const error = new CustomError(
          "0 games matching the filter",
          404,
          "0 games matching the filter"
        );

        expect(next).toHaveBeenCalledWith(error);
      });
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

describe("Given an updateOneGame controller", () => {
  const game = getRandomGame();
  const params = {
    id: game._id,
  };

  describe("When it receives a request with a correct id that exists on the database and the user id matches", () => {
    test("Then it should call the response method status with a 200", async () => {
      const expectedStatus = 200;
      req.params = params;
      req.userId = game.owner.toString();

      req.body = game;

      Game.findById = jest.fn().mockReturnValue(game);

      Game.findByIdAndUpdate = jest.fn().mockReturnValue(game);

      await updateOneGame(req as CustomRequest, res as Response, () => {});

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a request with a correct id and the user id doesnt't match", () => {
    test("Then it should call the response method status with a 500", async () => {
      req.params = params;
      req.userId = "";

      req.body = game;

      const customError = new CustomError(
        "User not allowed to edit",
        500,
        "User not allowed to edit"
      );

      Game.findById = jest.fn().mockReturnValue(game);

      Game.findByIdAndUpdate = jest.fn().mockReturnValue(game);

      await updateOneGame(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it receives a request with a game id that doesn't exist on the database", () => {
    test("Then it should call next with status with a 404", async () => {
      req.params = params;
      req.userId = game.owner.toString();

      req.body = game;

      Game.findById = jest.fn().mockReturnValue(game);

      Game.findByIdAndUpdate = jest.fn().mockRejectedValueOnce(new Error(""));

      await updateOneGame(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });
});
