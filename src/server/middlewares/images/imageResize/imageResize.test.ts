import type { NextFunction } from "express";
import fs from "fs/promises";
import { getRandomGame } from "../../../../factories/gamesFactory";
import type { CustomRequest } from "../../../../types";
import routes from "../../../routers/routes";
import imageResize from "./imageResize";

const newGame = getRandomGame();

let mockToFile = jest.fn();

jest.mock("sharp", () => () => ({
  resize: jest.fn().mockReturnValue({
    webp: jest.fn().mockReturnValue({
      toFormat: jest.fn().mockReturnValue({
        toFile: mockToFile,
      }),
    }),
  }),
}));

const file: Partial<Express.Multer.File> = {
  filename: "test",
  originalname: "testjpg",
};

const req: Partial<CustomRequest> = {
  body: newGame,
};

const next = jest.fn() as NextFunction;

beforeAll(async () => {
  await fs.writeFile(`${routes.uploadPath}/randomgame`, "randomgame");
});

afterAll(async () => {
  await fs.unlink(`${routes.uploadPath}/randomgame`);
});

describe("Given the imageResize middleware", () => {
  describe("When it's instantiated with a valid image", () => {
    test("Then it should call next", async () => {
      const expectedFilename = "test";
      req.file = file as Express.Multer.File;

      await imageResize(req as CustomRequest, null, next);

      expect(req.file.filename).toBe(expectedFilename);
    });
  });

  describe("When it's instantiated with an invalid image", () => {
    test("Then it should call next", async () => {
      jest.clearAllMocks();
      jest.restoreAllMocks();

      mockToFile = jest.fn().mockRejectedValue(new Error());

      await imageResize(req as CustomRequest, null, next);

      expect(next).toBeCalled();
    });
  });
});
