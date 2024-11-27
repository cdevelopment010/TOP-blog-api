const {Router} = require("express"); 
const router = Router(); 

router.get("/", (req, res) => {
    res.send("Get User")
})
router.post("/", (req, res) => {
    res.send("Post User")
})
router.delete("/:userId", (req, res) => {
    const { userId } = req.params;
    res.send("Delete User")
})

module.exports = router;