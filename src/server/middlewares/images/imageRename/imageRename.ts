import type { NextFunction, Response } from "express";
import fs from "fs/promises";
import path from "path";
import type { GameStructure } from "../../../../database/models/Game";
import type { CustomRequest } from "../../../../types";
import routes from "../../../routers/routes.js";

const imageRename = async (
  req: CustomRequest<
    Record<string, unknown>,
    Record<string, unknown>,
    GameStructure
  >,
  res: Response,
  next: NextFunction
) => {
  const timeStamp = Date.now();

  const fileExtension = path.extname(req.file.originalname);
  const fileBaseName = path.basename(req.file.originalname, fileExtension);
  const newFileName = `${fileBaseName}-${timeStamp}${fileExtension}`;
  const newFilePath = path.join(routes.uploadPath, newFileName);

  try {
    await fs.rename(
      path.join(routes.uploadPath, req.file.filename),
      newFilePath
    );

    req.file.filename = newFileName;

    next();
  } catch (error: unknown) {
    next(error);
  }
};

export default imageRename;
