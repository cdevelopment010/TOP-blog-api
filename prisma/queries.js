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

exports.updateUser = async (user) => {
    return await prisma.user.update({
        where: {
            id: parseInt(user.id)
        }, 
        data: {
            name: user.name,
            email: user.email,
            password: user.password, 
            admin: user.admin
        }
    })
}

exports.setUserAsAdmin = async (userId, updatedById) => {
    return await prisma.user.update({
        where: {
            id: parseInt(userId)
        }, 
        data: {
            admin: true, 
            updatedAt: new Date(), 
            updatedById: updatedById
        }
    })
}

exports.removeUserAsAdmin = async (userId, updatedById) => {
    return await prisma.user.update({
        where: {
            id: parseInt(userId)
        }, 
        data: {
            admin: false, 
            updatedAt: new Date(), 
            updatedById: updatedById
        }
    })
}

exports.deleteUserById = async (userId) => {
    await prisma.user.delete({
        where: {
            id: parseInt(userId)
        },
        include: {
            post: true, 
            comment: true,
            tag: true
        }
    })
}

exports.findUserById = async(userId) => {
    return await prisma.user.findFirst({
        where: {
            id: parseInt(userId)
        }
    })
}

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
            id: parseInt(post.id)
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


exports.hidePost = async (postId, userId) => {
    return await prisma.post.update({
        where: {
            id: parseInt(postId)
        },
        data: {
            published: false,
            publishedAt: null,
            publishedById: null,
            updatedById: userId,
            updatedAt: new Date()
        }
    })
}
exports.showPost = async (postId, userId) => {
    return await prisma.post.update({
        where: {
            id: parseInt(postId)
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
            id: parseInt(postId)
        }
    })
}

exports.findPostById = async (postId) => {
    return await prisma.post.findFirst({
        where: {
            id: parseInt(postId)
        }
    })
}

exports.findPostByAuthor = async (authorId) => {
    return await prisma.post.findMany({
        where: {
            createdById: parseInt(authorId)
        }
    })
}

exports.findPostByTag = async (tagId) => {
    return await prisma.post.findMany({
        where: {
            tagId: parseInt(tagId)
        }
    })
}
