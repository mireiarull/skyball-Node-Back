/* eslint-disable no-implicit-coercion */
import type { NextFunction, Request, Response } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import debugCreator from "debug";
import Game from "../../../database/models/Game.js";
import type { CustomRequest } from "../../../types.js";
import type { GameFormData } from "./types.js";
import { DateTime } from "luxon";

const debug = debugCreator("skyball: controllers: games");

export const getAllGames = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let games;
  let countGames: number;

  const pageOptions = {
    page: +req.query.page || 0,
    limit: 5,
    date: req.query.date as string,
  };
  try {
    if (pageOptions.date) {
      let startTime = DateTime.fromISO(pageOptions.date).startOf("day");
      const today = DateTime.now().startOf("day");
      if (startTime.toString() === today.toString()) {
        startTime = DateTime.now();
      }

      const endTime = DateTime.fromISO(pageOptions.date).endOf("day");

      games = await Game.find({
        dateTime: {
          $gte: startTime,
          $lt: endTime,
        },
      })
        .sort({ dateTime: "asc" })
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit)
        .exec();

      countGames = games.length;

      if (games.length === 0) {
        next(
          new CustomError(
            "0 games matching the filter",
            404,
            "0 games matching the filter"
          )
        );
        return;
      }
    } else {
      countGames = await Game.countDocuments().exec();
      games = await Game.find()
        .sort({ dateTime: "asc" })
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit)
        .exec();

      if (games.length === 0) {
        next(new CustomError("No available games", 404, "Games not found"));
      }
    }

    const checkPages = {
      isPreviousPage: pageOptions.page !== 0,
      isNextPage: countGames >= pageOptions.limit * (pageOptions.page + 1),
      totalPages: Math.ceil(countGames / pageOptions.limit),
    };

    res.status(200).json({ games: { ...checkPages, games } });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "Database error"
    );
    next(customError);
  }
};

export const getOneGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { gameId } = req.params;

  try {
    const game = await Game.findById(gameId);

    if (!game) {
      next(new CustomError("Game not found", 404, "Game not found"));
      return;
    }

    res.status(200).json(game);
  } catch (error: unknown) {
    next(new CustomError((error as Error).message, 500, "Database error"));
  }
};

export const addOneGame = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;
  const game = req.body as GameFormData;

  const players = [
    {
      userId,
      rol: "owner",
      material: {
        net: game.net,
        ball: game.ball,
        rods: game.rods,
      },
    },
  ];

  const gameLocation = {
    type: "Point",
    coordinates: [game.longitude, game.latitude],
  };

  try {
    const newGame = await Game.create({
      ...game,
      players,
      owner: userId,
      location: gameLocation,
    });

    res.status(201).json({
      ...newGame.toJSON(),
      image: newGame.image,
    });
  } catch (error: unknown) {
    debug((error as Error).message);
    const customError = new CustomError(
      (error as Error).message,
      500,
      "Error saving game"
    );

    next(customError);
  }
};

export const deleteOneGame = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { gameId } = req.params;
  const { userId } = req;

  try {
    const gameData = await Game.findById(gameId);

    if (gameData.owner.toString() !== userId) {
      const customError = new CustomError(
        "User not allowed",
        500,
        "User not allowed"
      );
      next(customError);
      return;
    }

    const game = await Game.findByIdAndDelete(gameId);
    res.status(200).json(game);
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      404,
      "Game not found"
    );
    next(customError);
  }
};

export const updateOneGame = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;
  const { gameId } = req.params;
  const gameToUpdate = req.body as GameFormData;

  const players = [
    {
      userId,
      rol: "owner",
      material: {
        net: gameToUpdate.net,
        ball: gameToUpdate.ball,
        rods: gameToUpdate.rods,
      },
    },
  ];

  try {
    const gameData = await Game.findById(gameId);

    if (gameData.owner.toString() !== userId) {
      const customError = new CustomError(
        "User not allowed to edit",
        500,
        "User not allowed to edit"
      );
      next(customError);
      return;
    }

    const newGameToUpdate = await Game.findByIdAndUpdate(
      gameId,
      {
        ...gameToUpdate,
        players,
        owner: userId,
      },
      {
        returnDocument: "after",
      }
    );

    res.status(200).json(newGameToUpdate);
  } catch (error: unknown) {
    debug((error as Error).message);
    const customError = new CustomError(
      (error as Error).message,
      404,
      "Game not found"
    );

    next(customError);
  }
};
