import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import type { GameStructure } from "../database/models/Game";

const gamesFactory = Factory.define<GameStructure>(() => ({
  date: faker.datatype.datetime(),
  format: faker.random.word(),
  gender: faker.name.gender(),
  level: faker.datatype.number(),
  spots: faker.datatype.number(),
  description: faker.lorem.sentence(),
  location: {
    type: "Point",
    coordinates: [
      faker.address.nearbyGPSCoordinate(),
      faker.address.nearbyGPSCoordinate(),
    ],
  },
  players: [
    {
      userId: new mongoose.Types.ObjectId(),
      rol: faker.random.word(),
      material: [faker.random.word()],
    },
  ],
}));

export const getRandomGame = () => gamesFactory.build();

export const getRandomGameList = (number: number) =>
  gamesFactory.buildList(number);
