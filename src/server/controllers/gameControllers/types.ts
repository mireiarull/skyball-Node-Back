import type { GameStructure } from "../../../database/models/Game";

export interface GameStructureWithId extends GameStructure {
  _id: string;
}
