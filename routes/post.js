const {Router} = require("express"); 
const router = Router(); 

router.get("/", (req, res) => {
    res.send("Get Posts")
})
router.post("/", (req, res) => {
    res.send("Post Posts")
})
router.delete("/:postId", (req, res) => {
    const { postId } = req.params;
    res.send("Delete Posts")
})

router.get("/:postId/Comments", (req, res) => {
    res.send("Get Post Comments")
})
router.post("/:postId/Comments", (req, res) => {
    res.send("Post Post Comments")
})
router.delete("/:postId/Comments/:commentId", (req, res) => {
    const { postId, commentId } = req.params;
    res.send("Delete Post Comment")
})

module.exports = router;