import type { NextFunction, Response } from "express";
import path from "path";
import sharp from "sharp";
import CustomError from "../../../../CustomError/CustomError.js";
import type { CustomRequest } from "../../../../types.js";
import routes from "../../../routers/routes.js";

const imageResize = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { filename } = req.file;

  try {
    const fileExtension = path.extname(req.file.filename);
    const fileBaseName = path.basename(req.file.filename, fileExtension);
    const newFileName = `${fileBaseName}`;

    await sharp(path.join(routes.uploadPath, filename))
      .webp({ quality: 90 })
      .toFormat("webp")
      .toFile(path.join(routes.uploadPath, `${newFileName}.webp`));

    req.body.image = `${newFileName}.webp`;

    next();
  } catch (error: unknown) {
    const newError = new CustomError(
      (error as Error).message,
      500,
      "Couldn't compress the image"
    );
    next(newError);
  }
};

export default imageResize;
