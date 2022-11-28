import express from "express";
import multer from "multer";
import path from "path";
import {
  addOneGame,
  getAllGames,
} from "../../controllers/gameControllers/gameControllers.js";
import auth from "../../middlewares/auth/auth.js";
import routes from "../routes.js";

// eslint-disable-next-line new-cap
const gameRouter = express.Router();

const upload = multer({
  dest: path.join("assets", "images"),
});

gameRouter.get(routes.listGames, getAllGames);
gameRouter.post(routes.addGame, auth, upload.single("image"), addOneGame);

export default gameRouter;
