const { Router } = require("express");

const multer = require("multer");
const uploadConfig = require("../configs/upload");
const UserAvatarController = require("../controllers/UserAvatarController");
const UsersController = require("../controllers/UsersController");

const usersRoutes = Router();
const upload = multer(uploadConfig.MULTER);
const usersController = new UsersController();
const userAvatarController = new UserAvatarController(); 
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");


usersRoutes.post("/", usersController.create);
usersRoutes.put("/", ensureAuthenticated, usersController.update);
usersRoutes.delete("/:id", ensureAuthenticated, usersController.delete);
usersRoutes.get("/:id", ensureAuthenticated, usersController.show);
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarController.update);


module.exports = usersRoutes;