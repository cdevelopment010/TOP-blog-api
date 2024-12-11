const { body, validationResult } = require("express-validator");
const db = require("../prisma/queries"); 
const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require('jsonwebtoken');

const userValidationCreate = [
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
]

const getUserById = async (req, res) => {
    const { userId } = req.params;
    console.log(userId);
    if (!userId) { 
        return res.sendStatus(404); 
    } 
    const user = await db.findUserById(userId); 
    return res.status(200).json({
        success: true, 
        message: 'Get user successfully', 
        data: user
    });
}

const createUser = [ 
    userValidationCreate, 
    async (req, res, next) => {
        const user = { 
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            admin: req.body.admin
        }

        const errors = validationResult(); 

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
                jwt.sign({user: user}, secretKey, function(err, token) {
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

const deleteUser = async (req, res, next) => {
    const { userId } = req.params;
    try { 
        const deletedUser = await db.deleteUserById(userId); 
        return res.status(200).json({
            success: true, 
            message: 'User deleted successfully',
            data: deletedUser
        }); 
    } catch(err) {
        console.error(err); 
        return next(err); 
    }
}

const updateUser = async (req, res, next) => {
    const { userId } = req.params; 
    const user = { 
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        admin: req.body.admin, 
        id: userId
    }
    try { 
        const userUpdated = await db.updateUser(user);  
        return res.status(200).json({
            success: true, 
            message: 'User updated successfully',
            data: userUpdated
            }); 
    } catch (err) { 
        console.error(err); 
        return next(err); 
    }
}

const addUserAdmin = async (req, res, next) => {
    const { userId } = req.params; 

    try { 
        const user = await db.setUserAsAdmin(userId, currentUser.id); 
        return res.status(200).json({
            success: true, 
            message: 'User set as admin successfully',
            data: user
        }); 
    } catch(err) {
        console.error(err); 
        return next(err); 
    }
}

const removeUserAdmin = async (req, res, next) => {
    const { userId } = req.params; 

    try { 
        const user = await db.setUserAsAdmin(userId, currentUser.id); 
        return res.status(200).json({
            success: true, 
            message: 'User removed as admin successfully',
            data: user
        });  
    } catch(err) {
        console.error(err); 
        return next(err); 
    }
}

module.exports = { 
    getUserById, 
    createUser,
    deleteUser, 
    updateUser,
    addUserAdmin, 
    removeUserAdmin
}