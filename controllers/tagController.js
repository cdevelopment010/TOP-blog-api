const db = require("../prisma/queries"); 
const jwt = require("jsonwebtoken");
const { body, validationResult} = require("express-validator");
const SECRET_KEY = process.env.SECRET_KEY || 'secret-key'

const tagValidation = [
    body("name")
        .isLength({min: 3}).withMessage("Tag must be at last 3 characters long")
]

const getAllTags = async (req, res, next) => {
    jwt.verify(req.token, SECRET_KEY, (err, authData) => {
        if(err) {
            return res.sendStatus(403); 
        } else { 
            const tags = []; //Need to write database queries.
            return res.status(200).json({
                message: "TAGS",
                auth: authData,
                data: tags,
            })
        }
    })
}

const getTagById = async (req, res, next) => {
    jwt.verify(req.token, SECRET_KEY, (err, authData) => {
        if(err) {
            return res.sendStatus(403); 
        } else { 
            const { tagId } = req.params; 
            const tag = []; //Need to write database queries.
            return res.status(200).json({
                message: "TAGS",
                auth: authData,
                data: tag,
            })
        }
    })
}

const createTag = [
    tagValidation,
    async (req, res, next) => {

        jwt.verify(req.token, SECRET_KEY, async (err, authData) => {
            if(err) {
                return res.sendStatus(403); 
            } else { 
                const tag = {
                    name: req.body.name, 
                    createById: currentUser.id
                }
                const errors = validationResult(req);
                if (!errors.isEmpty()) { 
                    return res.status(400).json({
                        success: false, 
                        message: errors.array(), 
                        data: tag,
                    })
                }
                await db.createTag(tag) //Create query
                .then((tag) => {

                })
                .catch(err => {
                    console.error(err); 
                    return res.status(404).json({
                        success: false, 
                        message: err.message, 
                        data: tag
                    })
                })
            }
        })
    }
]

const putTagById = [
    tagValidation, 
    async (req, res, next) => {
        //jwt verify
    }
]

const deleteTagById = async (req, res) => {
    //jwt verify
    const {tagId} = req.params; 
    await db.deleteTagById(tagId)
        .then(tag => {
            res.status(200).json({
                success:true, 
                message: "Tag successfully deleted",
                data: tag
            })
        })
        .catch(err => {
            console.error(err.message);
            return res.status(404).json({
                success: false, 
                message: `Unable to delete tag: ${err.message}`,
                data: tag
            })
        })
}


module.exports = {
    getAllTags,
    getTagById,
    createTag,
    putTagById,
    deleteTagById
}