/* eslint-disable @typescript-eslint/consistent-type-assertions */
import type { NextFunction, Response } from "express";
import fs from "fs/promises";
import { getRandomGame } from "../../../../factories/gamesFactory";
import type { CustomRequest } from "../../../../types";
import imageBackup from "./imageBackup";

jest.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        upload: jest.fn().mockResolvedValue({ error: null }),
        bucket: () => ({
          getPublicUrl: () => ({
            publicUrl: "testFileName.webptestOriginalName.webp",
          }),
        }),
      }),
    },
  }),
}));

const fileRequest = {
  filename: "testFileName.webp",
  originalname: "testOriginalName.webp",
} as Partial<Express.Multer.File>;

const newGame = getRandomGame();

const req = {
  body: newGame,
  file: fileRequest,
} as Partial<CustomRequest>;

const res = {} as Partial<Response>;
const next = jest.fn() as NextFunction;

beforeEach(async () => {
  await fs.writeFile("assets/images/testFileName.webp", "testFileName");
  await fs.writeFile("assets/images/testOriginalName.webp", "testOriginalName");
});

afterAll(async () => {
  await fs.unlink("assets/images/testFileName.webptestOriginalName.webp");
  await fs.unlink("assets/images/testOriginalName.webp");
  jest.clearAllMocks();
});

describe("Given a imageBackup middleware", () => {
  describe("When it's invoked with a request that has a file", () => {
    test("Then it should rename the file, upload it to supabase and call next", async () => {
      await imageBackup(req as CustomRequest, res as Response, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it's invoked with a request that doesn't have a file", () => {
    test("Then it should call next", async () => {
      const emptyReq: Partial<CustomRequest> = {
        body: newGame,
      };

      await imageBackup(emptyReq as CustomRequest, res as Response, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
