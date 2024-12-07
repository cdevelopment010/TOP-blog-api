const { Router } = require("express"); 
const jwt = require("jsonwebtoken");
const userMiddleware = require("../middleware/user"); 
const router = Router(); 
const SECRET_KEY = process.env.SECRET_KEY || 'secret-key'


router.get("/", (req, res) => {
    res.send("HOME!");
})
router.post("/signup", async (req, res) => {
    //create user with bycrypt needed
})

router.get("/login", (req, res) => {
    //authenticate user needed

    const user = { 
        id: 1, 
        username: 'admin', 
        email: 'admin@example.com'
    }
    
    jwt.sign({user: user}, SECRET_KEY, {expiresIn: '1h'},  (err, token) => {
        res.json({
            token: token
        })
    })

    //front end should save token to local storage
})

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