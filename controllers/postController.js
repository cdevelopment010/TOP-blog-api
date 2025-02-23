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

            postDetail.createdById= authData.user.id;
            postDetail.updatedById= authData.user.id;
        
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


//find published posts 
const getAllPublishedPosts = async(req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit);
    await db.findAllPublishedPosts(page, limit)
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

const getAllPublishedPostsByTag = async(req, res, next) => {
    const { tagId } = req.params;

    await db.findAllPublishedPostsByTag(tagId)
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
const getAllPublishedPostsBySlug = async(req, res, next) => {
    const { slug } = req.params;

    await db.findAllPublishedPostsBySlug(slug)
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
const getAllRecentPublishedPosts = async(req, res, next) => {
    const { recentNumber } = req.params;

    await db.findAllRecentPublishedPosts(recentNumber)
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

const getPostSearchResults = async (req, res, next) => {
    const { query } = req.query; 
    

    if (!query || query.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Search query cannot be empty",
        });
    }

    await db.searchPosts(query)
        .then(posts => {
            return res.status(200).json({
                success: true, 
                message: "posts found",
                data: posts
            })
        })
        .catch(err => {
            console.error("Error searching posts:", err);
            return res.status(400).json({
                success: false, 
                message: err.message,
            })
        })
}

///Comments
const getCommentsByPost = async(req, res, next) => {
    const {postId} = req.params; 


    await db.findCommentByPost(postId)
    .then(comments => {
        console.log("API Comments:", comments);
        return res.status(200).json({
            success: true, 
            message: 'Comments', 
            data: comments
        })
    })
    .catch(err => {
        return res.status(400).json({
            success: false, 
            message: err.message,
        })
    })
}

const getCommentById = async(req, res, next) => {
    const {commentId, postId} = req.params; 

    await db.findCommentById(commentId)
    .then(comment => {
        return res.status(200).json({
            success: true, 
            message: 'Comments', 
            data: comment
        })
    })
    .catch(err => {
        return res.status(400).json({
            success: false, 
            message: err.message,
        })
    })
}
const createComment = async(req, res, next) => {
    const { postId } = req.params; 
    const newComment = req.body.newComment; 

    await db.createComment(newComment)
        .then(comment => {
            return res.status(200).json({
                success: true, 
                message: 'Comments', 
                data: comment
            })
        })
        .catch(err => {
            return res.status(400).json({
                success: false, 
                message: err.message,
            })
        })
}
const deleteCommentById = async(req, res, next) => {

}
const updateCommentById = async(req, res, next) => {

}


const getTagsByPostId = async (req, res, next) => {
    const { postId } = req.params; 
    await db.tagsByPostId(postId)
        .then(tags => {
            return res.status(200).json({
                success: true, 
                message: 'Comments', 
                data: tags
            })
        })
        .catch(err => {
            return res.status(400).json({
                success: false, 
                message: err.message,
            })
        })
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
    getCommentsByPost,
    getCommentById,
    createComment,
    deleteCommentById,
    updateCommentById, 
    getAllPublishedPosts, 
    getAllPublishedPostsByTag,
    getAllPublishedPostsBySlug, 
    getAllRecentPublishedPosts, 
    getTagsByPostId,
    getPostSearchResults,
}