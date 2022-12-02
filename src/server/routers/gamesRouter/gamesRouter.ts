import express from "express";
import multer from "multer";
import path from "path";
import {
  addOneGame,
  deleteOneGame,
  getAllGames,
  getOneGame,
  updateOneGame,
} from "../../controllers/gameControllers/gameControllers.js";
import auth from "../../middlewares/auth/auth.js";
import imageBackup from "../../middlewares/images/imageBackup/imageBackup.js";
import imageRename from "../../middlewares/images/imageRename/imageRename.js";
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
gameRouter.delete(routes.delete, auth, deleteOneGame);
gameRouter.post(
  routes.addGame,
  auth,
  upload.single("image"),
  imageRename,
  imageResize,
  imageBackup,
  addOneGame
);
gameRouter.patch(routes.update, auth, updateOneGame);

export default gameRouter;
