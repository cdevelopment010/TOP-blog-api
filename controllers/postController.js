const db = require("../prisma/queries"); 
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || 'secret-key'

const createPost = async(req, res, next) => {
    jwt.verify(req.token, SECRET_KEY, async (err, authData) => {
        if(err) {
            return res.sendStatus(403); 
        } else { 
            const postDetail = req.body.post; 
            postDetail.createdById= authData.user.id;
            postDetail.updatedById= authData.user.id;
            // postDetail.createdById= req.body.currentUser.id;
            // postDetail.updatedById= req.body.currentUser.id;

            try { 
                const post = await db.createPost(postDetail); 
                return res.status(200).json({
                    message: "Post created",
                    auth: authData,
                    data: post,
                    authData: authData
                })
            } catch(err) {
                console.error(err); 
                return next(err);
            }
        }
    })
}

const publishPost = async (req, res, next) => {
    jwt.verify(req.token, SECRET_KEY, async (err, authData) => {
            if(err) {
                return res.sendStatus(403); 
            } else { 
                const { postId } = req.params;
                const currentUserId = authData.user.id;
                try { 
                    const post = await db.showPost(postId, currentUserId); 
                    return res.status(200).json({
                        message: "Post published",
                        auth: authData,
                        data: post,
                        authData: authData
                    })
                } catch(err) {
                    console.error(err); 
                    return next(err); 
                }
            }
        })
}

const unpublishPost = async(req, res, next) => {
    jwt.verify(req.token, SECRET_KEY, async (err, authData) => {
        if(err) {
            return res.sendStatus(403); 
        } else { 
            const { postId } = req.params;
            const currentUserId = authData.user.id;
            try { 
                const post = await db.hidePost(postId,currentUserId); 
                return res.status(200).json({
                    message: "Post unpublished",
                    auth: authData,
                    data: post,
                    authData: authData
                })
            } catch(err) {
                console.error(err); 
                return next(err); 
            }
        }
    })
}

const getAllPosts = async(req, res, next) => {
    // jwt.verify(req.token, SECRET_KEY, async (err, authData) => {
    //     if(err) {
    //         return res.sendStatus(403); 
    //     } else { 

    // Shouldn't need to veryify to view the posts
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

        // }
    // })
}

const getPostById = async(req, res, next) => {
    const { postId } = req.params;
    try { 
        const post = await db.findPostById(postId); 
        return res.status(200).json({
            success: true, 
            message: 'Posts by ID', 
            data: post
        })
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
    console.log("Update post controller", );
    jwt.verify(req.token, SECRET_KEY, async (err, authData) => {
        if(err) {
            return res.sendStatus(403); 
        } else { 
            const currentUserId = authData.user.id
            const postDetail = req.body.post; 
            postDetail.updatedById = currentUserId;
            try { 
                const post = await db.updatePost(postDetail); 
                return res.status(200).json({
                    success: true, 
                    message: 'Posts Updated', 
                    data: post
                })
            } catch(err) {
                console.error(err); 
                return next(err);
            }
        }
    })
}

const deletePost = async(req, res, next) => {

    jwt.verify(req.token, SECRET_KEY, async (err, authData) => {
        if(err) {
            return res.sendStatus(403); 
        } else { 
            const { postId } = req.params; 
            try { 
                const post = await db.deletePost(postId); 
                return res.status(200).json({
                    success: true, 
                    message: 'Posts Deleted', 
                    data: post
                }) 
            } catch(err) {
                console.error(err); 
                return next(err);
            }
        }
    })
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