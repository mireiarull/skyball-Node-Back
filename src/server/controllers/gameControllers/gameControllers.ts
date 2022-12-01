import type { NextFunction, Request, Response } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import debugCreator from "debug";
import Game from "../../../database/models/Game.js";
import type { CustomRequest } from "../../../types.js";
import type { GameFormData } from "./types.js";

const debug = debugCreator("skyball: controllers: games");

export const getAllGames = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const games = await Game.find();

    res.status(200).json({ games });
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

  const newGameForm = {
    dateTime: game.dateTime,
    location: {
      type: game.location.type,
      coordinates: [game.location.coordinates[0], game.location.coordinates[1]],
    },
    beachName: game.beachName,
    level: game.level,
    gender: game.gender,
    format: game.format,
    spots: game.spots,
    description: game.description,
    players: [
      {
        userId,
        rol: "owner",
        material: {
          net: game.net,
          ball: game.ball,
          rods: game.rods,
        },
      },
    ],
    image: game.image,
    owner: userId,
  };

  try {
    const newGame = await Game.create(newGameForm);

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
