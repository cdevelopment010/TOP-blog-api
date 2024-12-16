const db = require("../prisma/queries"); 
const jwt = require("jsonwebtoken");
const { body, validationResult} = require("express-validator");
const SECRET_KEY = process.env.SECRET_KEY || 'secret-key'

const tagValidation = [
    body("name")
        .isLength({min: 3}).withMessage("Tag must be at last 3 characters long")
]

const getAllTags = (req, res) => {
    jwt.verify(req.token, SECRET_KEY, async (err, authData) => {
        if(err) {
            return res.sendStatus(403); 
        } else { 
            const tags = db.findAllTags()
                .then(tags => {
                    return res.status(200).json({
                        message: "TAGS",
                        auth: authData,
                        data: tags,
                        authData: authData
                    })
                })
                .catch(err => {
                    return res.status(400).json({
                        success: false, 
                        message: err.message, 
                    })
                })
        }
    })
}

const getTagById = (req, res) => {
    jwt.verify(req.token, SECRET_KEY, async (err, authData) => {
        if(err) {
            return res.sendStatus(403); 
        } else { 
            const { tagId } = req.params; 
            const tag = db.findTagById(tagId)
                .then(tag => {
                    return res.status(200).json({
                        message: "TAGS",
                        auth: authData,
                        data: tag,
                        authData: authData
                    })
                })
                .catch(err => {
                    return res.status(400).json({
                        success: false, 
                        message: err.message, 
                        data: tag
                    })
                })
        }
    })
}

const createTag = [
    tagValidation,
    async (req, res) => {
        jwt.verify(req.token, SECRET_KEY, async (err, authData) => {
            if(err) {
                return res.sendStatus(403); 
            } else { 
                const tag = {
                    name: req.body.name, 
                    createById: req.body.currentUser.id, 
                    updatedById: req.body.currentUser.id,
                    deletedAt: null,
                }
                const errors = validationResult(req);
                if (!errors.isEmpty()) { 
                    return res.status(400).json({
                        success: false, 
                        message: errors.array(), 
                        data: tag,
                        authData: authData
                    })
                }
                await db.createTag(tag) //Create query
                .then((tag) => {
                    return res.status(200).json({
                        success: true,
                        message: 'Tag created', 
                        data: tag,
                        authData: authData
                    })
                })
                .catch(err => {
                    console.error(err); 
                    return res.status(404).json({
                        success: false, 
                        message: err.message, 
                        data: tag,
                        authData: authData
                    })
                })
            }
        })
    }
]

const putTagById = [
    tagValidation, 
    async (req, res) => {
        jwt.verify(req.token, SECRET_KEY, async (err, authData) => {
            if(err) {
                return res.sendStatus(403); 
            } else { 
                const errors = validationResult(req); 
                if (!errors.isEmpty()) {
                    console.error(errors.array()); 
                    return res.status(400).json({
                        success: false, 
                        message: errors.array()
                    })
                }
                const tag = {
                    id: req.params, 
                    name: req.body.name, 
                }
                await db.updateTag(tag)
                    .then(tag => {
                        return res.status(200).json({
                            success: true, 
                            message: 'Tag created successfully', 
                            data: tag
                        })
                    })
                    .catch(err => {
                        return res.status(400).json({
                            success: false, 
                            message: err.message,
                        })
                    })

            }
        })
    }
]

const deleteTagById = (req, res) => {
    jwt.verify(req.token, SECRET_KEY, async (err, authData) => {
        if(err) {
            return res.sendStatus(403); 
        } else { 
            const {tagId} = req.params; 
            await db.deleteTagById(tagId)
                .then(tag => {
                    res.status(200).json({
                        success:true, 
                        message: "Tag successfully deleted",
                        data: tag, 
                        authData: authData
                    })
                })
                .catch(err => {
                    console.error(err.message);
                    return res.status(404).json({
                        success: false, 
                        message: `Unable to delete tag: ${err.message}`,
                        data: tag,
                        authData: authData
                    })
                })
        }
    })
    
}


module.exports = {
    getAllTags,
    getTagById,
    createTag,
    putTagById,
    deleteTagById
}