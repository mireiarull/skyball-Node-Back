import type { InferSchemaType } from "mongoose";
import { Schema, model } from "mongoose";

const gameSchema = new Schema({
  dateTime: {
    type: String,
  },
  location: { type: { type: String }, coordinates: [Number] },
  beachName: {
    // Required: true,
    type: String,
  },
  level: {
    // Required: true,
    type: Number,
  },
  gender: {
    // Required: true,
    type: String,
  },
  format: {
    // Required: true,
    type: Number,
  },
  spots: {
    // Required: true,
    type: Number,
  },
  description: {
    type: String,
  },
  players: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      rol: {
        type: String,
      },
      material: {
        net: {
          type: Boolean,
        },
        ball: {
          type: Boolean,
        },
        rods: {
          type: Boolean,
        },
      },
    },
  ],
  image: {
    type: String,
  },
  backupImage: {
    type: String,
  },
});

gameSchema.index({ location: "2dsphere" });

export type GameStructure = InferSchemaType<typeof gameSchema>;

// eslint-disable-next-line @typescript-eslint/naming-convention
const Game = model("Game", gameSchema, "games");

export default Game;
