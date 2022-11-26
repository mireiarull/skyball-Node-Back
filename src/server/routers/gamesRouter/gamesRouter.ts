import express from "express";
import { getAllGames } from "../../controllers/gameControllers/gameControllers.js";
import routes from "../routes.js";

// eslint-disable-next-line new-cap
const gameRouter = express.Router();

gameRouter.get(routes.listGames, getAllGames);

export default gameRouter;
