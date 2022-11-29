import express from "express";
import multer from "multer";
import path from "path";
import {
  addOneGame,
  getAllGames,
  getOneGame,
} from "../../controllers/gameControllers/gameControllers.js";
import auth from "../../middlewares/auth/auth.js";
import imageBackup from "../../middlewares/images/imageBackup/imageBackup.js";
import imageResize from "../../middlewares/images/imageResize/imageResize.js";
import routes from "../routes.js";

// eslint-disable-next-line new-cap
const gameRouter = express.Router();

const upload = multer({
  dest: path.join("assets", "images"),
  limits: {
    fileSize: 8000000,
  },
});

gameRouter.get(routes.listGames, getAllGames);
gameRouter.get(routes.detailGame, auth, getOneGame);
gameRouter.post(
  routes.addGame,
  auth,
  upload.single("image"),
  imageResize,
  imageBackup,
  addOneGame
);

export default gameRouter;
