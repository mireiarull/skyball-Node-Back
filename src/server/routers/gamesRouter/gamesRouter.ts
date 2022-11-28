import express from "express";
import {
  addOneGame,
  getAllGames,
} from "../../controllers/gameControllers/gameControllers.js";
import auth from "../../middlewares/auth/auth.js";
import routes from "../routes.js";

// eslint-disable-next-line new-cap
const gameRouter = express.Router();

gameRouter.get(routes.listGames, getAllGames);
gameRouter.post(routes.addGame, auth, addOneGame);

export default gameRouter;
