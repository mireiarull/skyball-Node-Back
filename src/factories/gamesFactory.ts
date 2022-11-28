import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import type { GameStructure } from "../database/models/Game";

const gamesFactory = Factory.define<GameStructure>(() => ({
  date: faker.datatype.datetime(),
  format: faker.datatype.number({ min: 2, max: 6 }),
  gender: faker.name.gender(),
  level: faker.datatype.number(),
  spots: faker.datatype.number(),
  description: faker.lorem.sentence(),
  location: {
    type: "Point",
    coordinates: [11.111111111111111, 11.111111111111111],
  },
  beachName: faker.address.cityName(),
  players: [
    {
      userId: new mongoose.Types.ObjectId(),
      rol: faker.random.word(),
      material: {
        ball: true,
        net: false,
        rods: false,
      },
    },
  ],
  image: faker.random.alphaNumeric(),
  backupImage: faker.random.alphaNumeric(),
}));

export const getRandomGame = () => gamesFactory.build();

export const getRandomGameList = (number: number) =>
  gamesFactory.buildList(number);
