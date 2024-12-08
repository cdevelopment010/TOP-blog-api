const { body, validationResult } = require("express-validator"); 
const db = require("../prisma/queries"); 
const bcrypt = require("bcryptjs"); 
const passport = require("passport");
const jwt = require("jsonwebtoken");

const userValidationSignUp = [
    body("email")
        .isEmail().withMessage("Email must be a valid email")
        .isLength({min: 3}).withMessage("Email must be at least 3 characters long")
        .custom(async value => {
            const user = await db.getUserByEmail(value); 
            if (user) {
                throw new Error("This email is already in use")
            }
        }), 
    body("password")
        .isStrongPassword({
            minLength: 8
        }).withMessage("Password must contain at least 8 character, 1 lower case letter, 1 upper case letter, 1 number and 1 symbol")
        .isLength({min: 3}).withMessage("Password must be at least 3 characters"),
    body("confirmPassword").custom((value, { req}) => {
        return value == req.body.password;
    }).withMessage("Passwords must match")
]; 

const userValidationSignIn = [
    body("email")
        .isEmail().withMessage("Email must be of type email")
        .isLength({ min: 3 }).withMessage("Email must be at least 3 characters")
]



const postSignUpUser = [
    userValidationSignUp, 
    async (req, res, next) => {
        const user = { 
            email: req.body.email, 
            name: req.body.name,
            admin: false, 
        }

        const errors = validationResult(req); 
        if (!errors.isEmpty()) { 
            return res.sendStatus(400); 
        }

        bcrypt.hash(req.body.password, 15, async (err, hashedPassword) => {
            if (err) {
                return next(err); 
            } else { 
                user.password = hashedPassword; 
                await db.createUser(user)
                    .then((user) => {
                        req.login(user, (err) => {
                            if (err) { return next(err)}
                            return user; 
                        })
                    }).catch(err => {
                        const errors = [{msg: err.detail, code: err.code}]; 
                        return res.sendStatus(400); 
                    })
            }
        })
    }
]


const postSignInUser = [
    userValidationSignIn, 
    async (req, res, next) => {
        const user = { email: req.body.email}

        const errors = validationResult(req); 
        if (!errors.isEmpty()) {
            return res.sendStatus(400);
        }

        passport.authenticate("local", (err, user, info) => {
            if (err) {return next(err)}
            if (!user) {
                let errors = [{msg: info.message}]
                return res.sendStatus(400).message(errors); 
            }

            req.login(user, async(err)=> {
                if (err) { return next(err)}
                await db.findUserByEmail(user.email)
                    .then((user) => {
                        jwt.sign({user: user}, SECRET_KEY, {expiresIn: '1h'},  (err, token) => {
                            return res.json({
                                token: token,
                                user: user
                            })
                        })
                        //front end should save token to local storage
                        // return user; 
                    })
                    .catch(err => {
                        console.error(err); 
                        return next(err)
                    })
            })
        })(req, res, next);
    }
]

module.exports = { 
    postSignInUser, 
    postSignUpUser
}