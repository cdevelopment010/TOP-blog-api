const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient(); 


//user
exports.createUser = async (user) => {
    return await prisma.user.create({
        data: {
            name: user.name,
            email: user.email,
            password: user.password, 
            admin: user.admin
        }
    })
}

//Update user
//Set as admin
//remove admin
//delete user
//get user by Id



//Posts
exports.createPost = async (post) => {
    return await prisma.post.create({
        data: {
            title: post.title,
            content: post.content,
            published: post.published,
            publishedAt: post.published ? new Date() : null,
            publishedById: post.publishedById,
            createdById: post.createdById,
            updatedById: post.updatedById
        }
    })
}

exports.updatePost = async (post) => {
    return await prisma.post.update({
        where: {
            id: id
        }, 
        data: {
            title: post.title,
            content: post.content,
            published: post.published,
            publishedAt: post.published ? new Date() : null,
            publishedById: post.publishedById,
            createdById: post.createdById,
            updatedById: post.updatedById
        }
    })
}


exports.hidePost = async (postId) => {
    return await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            published: false,
            publishedAt: null,
            publishedById: null,
        }
    })
}
exports.showPost = async (postId, userId) => {
    return await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            published: true,
            publishedAt: new Date(),
            publishedById: userId,
        }
    })
}

exports.deletePost = async (postId) => {
    await prisma.post.delete({
        where: {
            id: postId
        }
    })
}

//get post by id
//get post by author? 
//get post by tag
