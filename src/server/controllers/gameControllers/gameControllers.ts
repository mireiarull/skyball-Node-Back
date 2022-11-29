import type { NextFunction, Request, Response } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import debugCreator from "debug";
import type { GameStructure } from "../../../database/models/Game.js";
import Game from "../../../database/models/Game.js";
import type { CustomRequest } from "../../../types.js";

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
  const game = req.body as GameStructure;

  try {
    const newGame = await Game.create({ ...game, owner: userId });

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
