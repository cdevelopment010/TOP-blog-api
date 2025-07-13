const { Router } = require("express"); 
const controller = require("../controllers/index");

const router = Router(); 


router.get("/", (req, res) => {
    res.send("HOME!");
})
router.post("/feedback", controller.submitFeedback);

router.get("/sitemap.xml",controller.createSitemap); 

module.exports = router;