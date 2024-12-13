const { Router } = require("express"); 
const jwt = require("jsonwebtoken");
const userMiddleware = require("../middleware/user"); 
const router = Router(); 
const SECRET_KEY = process.env.SECRET_KEY || 'secret-key'
const userController = require("../controllers/userController"); 


router.get("/", (req, res) => {
    res.send("HOME!");
})
router.post("/signup",userController.createUser)
router.post("/login", userController.postSignInUser)

router.get("/Tags", userMiddleware.verifyToken, (req, res) => {
    jwt.verify(req.token, SECRET_KEY, (err, authData) => {
        if(err) {
            res.sendStatus(403); 
        } else { 
            console.log();
            res.json({
                message: "TAGS",
                auth: authData
            })
        }
    });
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