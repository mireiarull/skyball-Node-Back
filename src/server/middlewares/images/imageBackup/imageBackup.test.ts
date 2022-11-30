import type { NextFunction } from "express";
import fs from "fs/promises";
import { getRandomGame } from "../../../../factories/gamesFactory";
import type { CustomRequest } from "../../../../types";

import imageBackup, { bucket } from "./imageBackup";

const newGame = getRandomGame();
delete newGame.backupImage;

const req: Partial<CustomRequest> = {
  body: newGame,
};

const next = jest.fn() as NextFunction;

afterAll(async () => {
  jest.clearAllMocks();
});

describe("Given a imageBackup middleware", () => {
  describe("When it's invoked with a request that has a file", () => {
    test("Then it should rename the file, upload it to supabase and call next", async () => {
      fs.readFile = jest.fn().mockResolvedValueOnce(newGame.image);

      bucket.getPublicUrl = jest.fn().mockReturnValueOnce({
        data: { publicUrl: newGame.image },
      });
      await imageBackup(req as CustomRequest, null, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it's invoked with an invalid request", () => {
    test("Then it should call next", async () => {
      await imageBackup(req as CustomRequest, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
