const { Router } = require("express"); 
const router = Router(); 


router.get("/", (req, res) => {
    res.send("HOME!");
})

router.get("/Tags", (req, res) => {
    res.send("TAGS")
})

router.post("/Tags", (req, res) => {
    res.send("Create Tag");
})


router.get("/Tags/:tagId", (req, res) => {
    const { tagId } = req.params;
    res.send(`Tag: ${tagId}`);
})

router.put("/Tags/:tagId", (req, res) => {
    const { tagId } = req.params;
    res.send(`Updated Tag: ${tagId}`);
})

router.delete("/Tags/:tagId", (req, res) => {
    const { tagId } = req.params;
    res.send(`Delete Tag: ${tagId}`);
})

module.exports = router;