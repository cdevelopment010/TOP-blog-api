const { Router } = require("express"); 
const router = Router(); 


router.use("/", (req, res) => {
    res.send("HOME!");
})

module.exports = router;