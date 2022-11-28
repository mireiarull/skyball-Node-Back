import type { NextFunction, Request, Response } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import debugCreator from "debug";
import fs from "fs/promises";
import path from "path";
import type { GameStructure } from "../../../database/models/Game.js";
import Game from "../../../database/models/Game.js";
import { createClient } from "@supabase/supabase-js";
import environment from "../../../loadEnvironment.js";

const debug = debugCreator("skyball: controllers: games");

const supaBase = createClient(environment.supabaseUrl, environment.supabaseKey);

const bucket = supaBase.storage.from(environment.supabaseBucketId);

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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const game = req.body as GameStructure;

  try {
    if (req.file) {
      await fs.rename(
        path.join("assets", "images", req.file.filename),
        path.join("assets", "images", req.file.filename + req.file.originalname)
      );

      const filecontent = await fs.readFile(
        path.join("assets", "images", req.file.filename + req.file.originalname)
      );

      await bucket.upload(
        req.file.filename + req.file.originalname,
        filecontent
      );
      const {
        data: { publicUrl },
      } = bucket.getPublicUrl(req.file.filename + req.file.originalname);

      const image = req.file
        ? req.file.filename + req.file.originalname
        : publicUrl;

      const newGame = await Game.create(game);

      res.status(201).json({ ...newGame, image });
    }
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
