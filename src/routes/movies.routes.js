const { Router } = require("express");

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const MoviesController = require("../controllers/MoviesController");
const moviesRoutes = Router();
const moviesController = new MoviesController();

moviesRoutes.use(ensureAuthenticated)

moviesRoutes.post("/", moviesController.create);
moviesRoutes.put("/:user_id", moviesController.update);
moviesRoutes.delete("/:id", moviesController.delete);
moviesRoutes.get("/:title", moviesController.index);
moviesRoutes.get("/", moviesController.index);




module.exports = moviesRoutes;