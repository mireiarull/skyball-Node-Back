import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import type { NextFunction, Response } from "express";
import path from "path";
import environment from "../../../loadEnvironment.js";
import type { CustomRequest } from "../../../types.js";
import type { GameStructure } from "../../../database/models/Game.js";

const { supabaseBucketId, supabaseKey, supabaseUrl } = environment;

const supaBase = createClient(supabaseUrl, supabaseKey);

const bucket = supaBase.storage.from(supabaseBucketId);

const handleImage = async (
  req: CustomRequest<
    Record<string, unknown>,
    Record<string, unknown>,
    GameStructure
  >,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    next();
    return;
  }

  const newFilePath = path.join(
    "assets",
    "images",
    req.file.filename + req.file.originalname
  );

  try {
    await fs.rename(
      path.join("assets", "images", req.file.filename),
      newFilePath
    );
    const fileContent = await fs.readFile(newFilePath);

    await bucket.upload(req.file.filename + req.file.originalname, fileContent);

    const {
      data: { publicUrl },
    } = bucket.getPublicUrl(req.file.filename + req.file.originalname);

    req.body.image = newFilePath;
    req.body.backupImage = publicUrl;

    next();
  } catch (error: unknown) {
    next(error);
  }
};

export default handleImage;
