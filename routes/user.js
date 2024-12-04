const {Router} = require("express"); 
const router = Router(); 
const userController = require("../controllers/userController");

router.get("/:userId", userController.getUserById)
router.post("/", userController.createUser)
router.delete("/:userId", userController.deleteUser)
router.put("/:userId/admin/add", userController.addUserAdmin);
router.put("/:userId/admin/delete", userController.removeUserAdmin);

module.exports = router;