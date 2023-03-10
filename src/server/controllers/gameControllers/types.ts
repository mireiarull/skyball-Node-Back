import type { GameStructure } from "../../../database/models/Game";

export interface GameStructureWithId extends GameStructure {
  _id: string;
}

export interface GameFormData {
  dateTime: string;
  beachName: string;
  level: number;
  gender: "M" | "F" | "X";
  format: number;
  spots: number;
  description: string;
  ball: boolean;
  net: boolean;
  rods: boolean;
  image: unknown;
  latitude: number;
  longitude: number;
}
