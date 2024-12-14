const {body, validationResult} = require("express-validator"); 
const passport = require("../config/passport");
const db = require("../prisma/queries"); 
const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'secret-key';

const userValidationCreate = [
    body("email")
        .isEmail().withMessage("Email must be a valid email")
        .isLength({min: 3}).withMessage("Email must be at least 3 characters long")
        .custom(async value => {
            const user = await db.findUserByEmail(value); 
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
]


const userValidationSignIn = [
    body("email")
        .isEmail().withMessage("Email must be of type email")
        .isLength({ min: 3 }).withMessage("Email must be at least 3 characters")
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
                            return res.status(200).json({
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

const createUser = [ 
    userValidationCreate, 
    async (req, res, next) => {
        const user = { 
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            admin: req.body.admin
        }

        const errors = validationResult(req); 

        if (!errors.isEmpty()) { 
            return res.status(400).json({
                success: false, 
                message: errors.array(), 
                data: user,
            })
        }

        bcrypt.hash(req.body.password, 15, async(err, hashedPassword) => {
            if (err) { 
                return next(err); 
            }

            user.password = hashedPassword; 
            try { 
                const created = await db.createUser(user);
                jwt.sign({user: user}, SECRET_KEY, {expiresIn: '1d'}, function(err, token) {
                    if (err) {
                        return next(err); 
                    }
                    return res.status(200).json({
                        success: true, 
                        token: token, 
                        message: 'User created successfully',
                        data: created
                    })
                })

            } catch(err) {
                console.error(err); 
                return next(err)
            }

        })

    }
]

module.exports = {
    createUser,
    postSignInUser,
};