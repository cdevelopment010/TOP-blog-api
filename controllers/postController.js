const db = require("../prisma/queries"); 

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
const getCommentById = async(req, res, next) => {
    
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