import type { NextFunction, Response } from "express";
import fs from "fs/promises";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { environment } from "../../../../loadEnvironment.js";
import type { CustomRequest } from "../../../../types";
import type { GameStructure } from "../../../../database/models/Game";
import routes from "../../../routers/routes.js";

const { supabaseBucketId, supabaseKey, supabaseUrl } = environment;

const supaBase = createClient(supabaseUrl, supabaseKey);

export const bucket = supaBase.storage.from(supabaseBucketId);

const imageBackup = async (
  req: CustomRequest<
    Record<string, unknown>,
    Record<string, unknown>,
    GameStructure
  >,
  res: Response,
  next: NextFunction
) => {
  const { image } = req.body;

  try {
    const mainImage = image;
    const fileContent = await fs.readFile(
      path.join(routes.uploadPath, mainImage)
    );

    await bucket.upload(mainImage, fileContent);

    const {
      data: { publicUrl },
    } = bucket.getPublicUrl(mainImage);

    req.body.backupImage = publicUrl;

    next();
  } catch (error: unknown) {
    next(error);
  }
};

export default imageBackup;
