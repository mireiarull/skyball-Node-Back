import fs from "fs/promises";
import path from "path";
import type { GameStructure } from "../../../../database/models/Game";
import { getRandomGame } from "../../../../factories/gamesFactory";
import type { CustomRequest } from "../../../../types";
import routes from "../../../routers/routes";

import imageRename from "./imageRename";

const newGame = getRandomGame();

const req: Partial<
  CustomRequest<Record<string, unknown>, Record<string, unknown>, GameStructure>
> = {
  body: newGame,
};

const next = jest.fn();

const timestamp = Date.now();
jest.useFakeTimers();
jest.setSystemTime(timestamp);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given a imagesRename middleware", () => {
  const expectedFileName = `image-${timestamp}.jpg`;

  beforeEach(async () => {
    await fs.writeFile(
      path.join(routes.uploadPath, "filehash"),
      Buffer.from("")
    );
  });

  afterAll(async () => {
    await fs.unlink(`${routes.uploadPath}/image-${timestamp}.jpg`);
    await fs.unlink(`${routes.uploadPath}/filehash`);
  });

  describe("When it receives a CustomRequest with an image file 'image.jpg'", () => {
    test("Then it should rename the file by adding a time stamp to the original name and call next", async () => {
      const file: Partial<Express.Multer.File> = {
        filename: "filehash",
        originalname: "image.jpg",
        path: path.join(routes.uploadPath, "filehash"),
      };

      req.file = file as Express.Multer.File;

      await imageRename(req as CustomRequest, null, next);

      expect(req.file.filename).toBe(expectedFileName);
    });
  });

  describe("When it receives a CustomRequest with an image file 'image.jpg' and fs rejects", () => {
    test("Then it should call next with the thrown error", async () => {
      const file: Partial<Express.Multer.File> = {
        filename: "image.jpg",
        originalname: "image.jpg",
        path: path.join(routes.uploadPath, "filehash"),
      };

      req.file = file as Express.Multer.File;

      const error = new Error("");
      fs.rename = jest.fn().mockRejectedValueOnce(error);

      await imageRename(req as CustomRequest, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
