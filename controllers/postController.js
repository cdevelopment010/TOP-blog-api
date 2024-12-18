const db = require("../prisma/queries"); 
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || 'secret-key'

const createPost = async(req, res, next) => {
    const postDetail = {
        title: req.body.title, 
        content: req.body.content,
        createdById: currentUser.id,
        updatedById: currentUser.id,
    }

    try { 
        const post = await db.createPost(postDetail); 
        res.sendStatus(200); 
        return post; 
    } catch(err) {
        console.error(err); 
        return next(err);
    }
}

const publishPost = async (req, res, next) => {
    const { postId } = req.params;
    try { 
        const post = await db.showPost(postId, currentUser.id); 
        res.sendStatus(200); 
        return post; 
    } catch(err) {
        console.error(err); 
        return next(err); 
    }
}

const unpublishPost = async(req, res, next) => {
    const { postId } = req.params;
    try { 
        const post = await db.hidePost(postId, currentUser.id); 
        res.sendStatus(200); 
        return post; 
    } catch(err) {
        console.error(err); 
        return next(err); 
    }
}

const getAllPosts = async(req, res, next) => {
    jwt.verify(req.token, SECRET_KEY, async (err, authData) => {
        if(err) {
            return res.sendStatus(403); 
        } else { 
            await db.findAllPosts()
                .then(posts => {
                    return res.status(200).json({
                        success: true, 
                        message: 'Posts', 
                        data: posts
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

const getPostById = async(req, res, next) => {
    const { postId } = req.params;
    try { 
        const post = await db.findPostById(postId); 
        res.sendStatus(200); 
        return post; 
    } catch (err) { 
        console.error(err); 
        return next(err); 
    }
}

const getPostByAuthor = async(req, res, next) => {
    const { authorId } = req.params;
    try { 
        const post = await db.findPostByAuthor(authorId); 
        res.sendStatus(200); 
        return post; 
    } catch (err) { 
        console.error(err); 
        return next(err); 
    }
}

const getPostByTag = async(req, res, next) => {
    const { tagId } = req.params;
    try { 
        const post = await db.findPostByTag(tagId); 
        res.sendStatus(200); 
        return post; 
    } catch (err) { 
        console.error(err); 
        return next(err); 
    }
}

const updatePost = async(req, res, next) => {
    const { postId } = req.params; 
    const postDetail = {
        id: postId,
        title: req.body.title, 
        content: req.body.content,
        createdById: currentUser.id,
        updatedById: currentUser.id,
        published: req.body.published,
        publishedById: req.body.publishedById, 
        publishedAt: req.body.publishedAt,

    }
    try { 
        const post = await db.updatePost(postDetail); 
        res.sendStatus(200); 
        return post; 
    } catch(err) {
        console.error(err); 
        return next(err);
    }
}

const deletePost = async(req, res, next) => {
    const { postId } = req.params; 
    try { 
        const post = await db.deletePost(postId); 
        res.sendStatus(200); 
        return post; 
    } catch(err) {
        console.error(err); 
        return next(err);
    }
}


///Comments
const getCommentsByPost = async(req, res, next) => {
    const {postId} = req.params; 

    try {
        const comments = await db.findCommentByPost(postId); 
        res.sendStatus(200); 
        return comments; 
    } catch (err) {
        console.log(err); 
        return next(err);
    }
}

const getCommentById = async(req, res, next) => {
    const {commentId, postId} = req.params; 

    try {
        const comment = await db.findCommentById(commentId); 
        res.sendStatus(200); 
        return comment; 
    } catch (err) {
        console.log(err); 
        return next(err);
    }
}
const createComment = async(req, res, next) => {

}
const deleteCommentById = async(req, res, next) => {

}
const updateCommentById = async(req, res, next) => {

}



module.exports = {
    createPost,
    publishPost, 
    unpublishPost,
    getAllPosts,
    getPostById,
    getPostByAuthor,
    getPostByTag,
    updatePost,
    deletePost,
    getCommentById,
    createComment,
    deleteCommentById,
    updateCommentById
}