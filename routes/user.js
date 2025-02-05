const {Router} = require("express"); 
const router = Router(); 
const userController = require("../controllers/userController");

router.put("/updatePassword", userController.updatePassword);
router.put("/:userId/admin/add", userController.addUserAdmin);
router.put("/:userId/admin/delete", userController.removeUserAdmin);
router.post("/", userController.createUser)
router.delete("/:userId", userController.deleteUser);
router.get("/:userId", userController.getUserById)

module.exports = router;