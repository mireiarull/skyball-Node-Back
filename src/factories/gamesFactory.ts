import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import type { GameStructureWithId } from "../server/controllers/gameControllers/types";

const gamesFactory = Factory.define<GameStructureWithId>(() => ({
  dateTime: faker.datatype.string(),
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
  _id: new mongoose.Types.ObjectId().toString(),
}));

export const getRandomGame = () => gamesFactory.build();

export const getRandomGameList = (number: number) =>
  gamesFactory.buildList(number);
