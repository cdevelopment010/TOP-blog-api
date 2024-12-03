const {Router} = require("express"); 
const router = Router(); 
const userControler = require("../controllers/userController");

router.get("/:userId", userControler.getUserById)
router.post("/", (req, res) => {
    res.send("Post User")
})
router.delete("/:userId", (req, res) => {
    const { userId } = req.params;
    res.send("Delete User")
})

module.exports = router;