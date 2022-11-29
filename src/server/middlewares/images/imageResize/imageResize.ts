import type { NextFunction, Response } from "express";
import path from "path";
import sharp from "sharp";
import CustomError from "../../../../CustomError/CustomError.js";
import type { CustomRequest } from "../../../../types";

const imageResize = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { originalname, filename } = req.file;
  try {
    await sharp(path.join("assets/images", filename))
      .resize(320, 180, { fit: "cover" })
      .webp({ quality: 90 })
      .toFormat("webp")
      .toFile(path.join("assets/images", `${originalname}.webp`));

    req.file.filename = `${originalname}.webp`;
    req.file.originalname = `${originalname}.webp`;

    next();
  } catch {
    const newError = new CustomError(
      "Couldn't compress the image",
      500,
      "Couldn't compress the image"
    );
    next(newError);
  }
};

export default imageResize;
