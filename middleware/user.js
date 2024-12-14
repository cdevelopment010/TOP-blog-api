
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || 'secret-key'

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization']; 
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]; 
        req.token = bearerToken; 
        next();  
    } else { 
        res.sendStatus(403); 
    }
}

const verifyRoute = async(cb) => {
    //Think about this a bit more.
}

module.exports = { 
    verifyToken,
}