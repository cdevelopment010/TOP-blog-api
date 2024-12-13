const { Router } = require("express"); 
const router = Router(); 
const controller = require("../controllers/authController"); 

router.post("/login", controller.postSignInUser); 
router.post("/sign-up", controller.createUser)

module.exports = router; 