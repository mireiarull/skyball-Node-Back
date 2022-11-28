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

export const addOneGame = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const game = req.body as GameStructure;

  try {
    const newGame = await Game.create(game);

    res
      .status(201)
      .json({
        ...newGame.toJSON(),
        image: game.image
          ? `${req.protocol}://${req.get("host")}/${game.image}`
          : "",
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
