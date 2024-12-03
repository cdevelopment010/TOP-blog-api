const { Router } = require("express"); 
const router = Router(); 


router.get("/", (req, res) => {
    res.send("HOME!");
})

module.exports = router;