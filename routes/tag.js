const { Router } = require("express");
const router = Router(); 
const controller = require("../controllers/tagController"); 
const middleware = require("../middleware/user"); 

router.get("/", middleware.verifyToken, controller.getAllTags); //List all tags
router.post("/", middleware.verifyToken, controller.createTag); //Create new tag
router.get("/:tagId", middleware.verifyToken, controller.getTagById); //Get one tag by ID
router.put("/:tagId", middleware.verifyToken, controller.putTagById); //Update one tag
router.delete("/:tagId", middleware.verifyToken, controller.deleteTagById); //delete one tag

module.exports = router; 
