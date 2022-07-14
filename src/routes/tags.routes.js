const { Router } = require("express");

const TagsController = require("../controllers/TagsController");

const tagsRoutes = Router();

const tagsController = new TagsController();


tagsRoutes.post("/", tagsController.create);
tagsRoutes.delete("/:id", tagsController.delete);
tagsRoutes.get("/:id", tagsController.show); 
tagsRoutes.get("/", tagsController.index);



module.exports = tagsRoutes;