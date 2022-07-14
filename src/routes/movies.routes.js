const { Router } = require("express");

const MoviesController = require("../controllers/MoviesController");

const moviesRoutes = Router();

const moviesController = new MoviesController();


moviesRoutes.post("/:user_id", moviesController.create);
moviesRoutes.put("/:user_id", moviesController.update);
moviesRoutes.delete("/:id", moviesController.delete);
moviesRoutes.get("/:id", moviesController.show);
moviesRoutes.get("/", moviesController.index);



module.exports = moviesRoutes;