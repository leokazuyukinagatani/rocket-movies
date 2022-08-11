const { Router } = require("express");

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const MoviesController = require("../controllers/MoviesController");
const moviesRoutes = Router();
const moviesController = new MoviesController();

moviesRoutes.use(ensureAuthenticated)

moviesRoutes.post("/", moviesController.create);
moviesRoutes.put("/", moviesController.update);
moviesRoutes.delete("/:id", moviesController.delete);
moviesRoutes.get("/", moviesController.index);
moviesRoutes.get("/:id", moviesController.show);




module.exports = moviesRoutes;
