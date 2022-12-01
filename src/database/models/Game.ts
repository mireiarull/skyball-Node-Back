import type { InferSchemaType } from "mongoose";
import { Schema, model } from "mongoose";

const gameSchema = new Schema({
  dateTime: {
    type: String,
  },
  location: {
    type: { type: String },
    coordinates: {
      type: [Number],
    },
  },
  beachName: {
    required: true,
    type: String,
  },
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
    type: Number,
  },
  spots: {
    required: true,
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
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

gameSchema.index({ location: "2dsphere" });

export type GameStructure = InferSchemaType<typeof gameSchema>;

// eslint-disable-next-line @typescript-eslint/naming-convention
const Game = model("Game", gameSchema, "games");

export default Game;
