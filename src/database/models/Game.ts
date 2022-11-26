import type { InferSchemaType } from "mongoose";
import { Schema, model } from "mongoose";

const locationSchema = new Schema({
  loc: {
    type: { type: String },
    coordinates: [],
  },
});

locationSchema.index({ loc: "2dsphere" });

const gameSchema = new Schema({
  date: {
    required: true,
    type: Date,
  },
  location: locationSchema,
  level: {
    required: true,
    type: Number,
  },
  gender: {
    required: true,
    type: String,
  },
  format: {
    required: true,
    type: String,
  },
  spots: {
    required: true,
    type: Number,
  },
  description: {
    type: String,
  },
  players: {
    userId: {
      type: Schema.Types.ObjectId,
    },
    rol: {
      type: String,
    },
    material: {
      type: Array,
    },
  },
});

export type GameStructure = InferSchemaType<typeof gameSchema>;

// eslint-disable-next-line @typescript-eslint/naming-convention
const Game = model("Game", gameSchema, "games");

export default Game;
