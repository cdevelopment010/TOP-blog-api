const prisma = require('../config/prisma'); 

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

exports.updateUserPassword = async (user) => {
    return await prisma.user.update({
        where: {
            email: user.email
        }, 
        data : { 
            password: user.password
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
exports.findUserByEmail = async(userEmail) => {
    return await prisma.user.findFirst({
        where: {
            email: userEmail
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
            // createdById: post.createdById,
            createdByUser: {connect: {id: post.createdById}},
            // updatedById: post.updatedById ?? null,
            updatedByUser: {connect: {id: post.updatedById}}, 
            tags: {connect: post.tagId.map(tag => ({id: parseInt(tag.id)}))},
            slug: post.slug, 
            metaDescription: post.metaDescription, 
            metaKeywords: post.metaKeywords
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
            createdByUser: {connect: {id: post.createdById}},            
            updatedByUser: {connect: {id: post.updatedById}}, 
            tags: {connect: post.tagId.map(tag => ({id: parseInt(tag.id)}))},
            slug: post.slug, 
            metaDescription: post.metaDescription, 
            metaKeywords: post.metaKeywords
        }
    })
}


exports.hidePost = async (postId, userId) => {
    try { 
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
    } catch(err) { 
        console.error("Error"); 
        throw err;
    }
    
}
exports.showPost = async (postId, userId) => {
    try { 
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
    } catch (err) { 
        console.error(err); 
        throw err; 
    }
    
}

exports.deletePost = async (postId) => {
    await prisma.post.delete({
        where: {
            id: parseInt(postId)
        }
    })
}

exports.findAllPosts = async () => {
    return await prisma.post.findMany({
        orderBy: {
            createdAt: 'asc'
        }
    });
}

exports.findPostById = async (postId) => {
    return await prisma.post.findFirst({
        where: {
            id: parseInt(postId)
        },
        include: {
            tags: true
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

exports.tagsByPostId = async (postId) => {
    try {
        const tags = await prisma.post.findUnique({
            where: { id: parseInt(postId) },
            select: {
                tags: {
                    select: { name: true, id: true },
                },
            },
        });
        return tags;
    } catch (error) {
        console.error("Error fetching tags:", error);
        throw error; // Rethrow the error for further handling
    }
}

exports.findAllPublishedPosts = async (page = 1, limit = 5) => {
    const skip = limit*(page - 1);

    const totalPosts = await prisma.post.count({
        where: { published: true }
    });

    const posts = await prisma.post.findMany({
        where: {published: true},
        orderBy: {publishedAt: 'desc'},
        skip: skip,
        take: limit
    });

    // Add slugCombined field
    const postWithSlugs = posts.map(post => ({
        ...post,
        slugCombined: post.slug?.replace(/\s+/g, '-').toLowerCase()
    }));

    return {
        data: postWithSlugs,
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts: totalPosts
    }
}

exports.findAllPublishedPostsByTag = async (tagId) => {
    const posts =  await prisma.post.findMany({
        where: {
            published: true,
            tags: {
                some: {
                    id: parseInt(tagId)
                }
            }
        },
        orderBy: {
            publishedAt: 'desc'
        }
    });

    return posts.map(post => ({
        ...post,
        slugCombined: post.slug?.replace(/\s+/g, '-').toLowerCase()
    }));
}

exports.findAllPublishedPostsBySlug = async (slug) => {
    const originalSlug = slug.replace(/-/g, " "); 
    const posts =  await prisma.post.findMany({
        where: {
            published: true,
            slug: originalSlug
        },
        orderBy: {
            publishedAt: 'desc'
        }
    });

    return posts.map(post => ({
        ...post,
        slugCombined: post.slug?.replace(/\s+/g, '-').toLowerCase()
    }));
}

exports.findAllRecentPublishedPosts = async (number) => {
    const posts = await prisma.post.findMany({
        take: parseInt(number),
        where: {
            published: true,
        },
        orderBy: {
            publishedAt: 'desc'
        }
    });

    return posts.map(post => ({
        ...post,
        slugCombined: post.slug?.replace(/\s+/g, '-').toLowerCase()
    }));
}

exports.searchPosts = async (searchQuery) => {
    return await prisma.post.findMany({
        where: {
            published: true,
            OR: [
                { title: { contains: searchQuery, mode: 'insensitive' } }, 
                { tags: { some: { name: { contains: searchQuery, mode: 'insensitive' } } } }, 
            ],
        },
        orderBy: {
            publishedAt: 'desc',
        },
    });
};

//Likes

exports.postLikeCount = async (postId) => {
    const post = await prisma.post.findUnique({
        where: { id: parseInt(postId) },
        select: { numberOfLikes: true } // Return only likes count
    });

    return post ? post.numberOfLikes : 0;
};


exports.postLike = async (postId, type) => {
    exports.postLike = async (postId, type) => {
        return await prisma.post.update({
            where: { id: postId },
            data: {
                numberOfLikes: {
                    [type === "add" ? "increment" : "decrement"]: 1
                }
            }
        });
    };
}

//Comments
exports.findCommentById = async (commentId) => {
    return await prisma.comment.findFirst({
        where: { 
            id: parseInt(commentId),
        }
    })
}

exports.findCommentByPost = async (postId) => {
    const comments =  await prisma.comment.findMany({
        where: {
            postId: parseInt(postId)
        }
    })
    return comments; 
}

exports.createComment = async (comment) => {
    return await prisma.comment.create({
        data: { 
            postId: parseInt(comment.postId),
            createdAt: comment.createdAt,
            comment: comment.comment,
        }
    })
}

exports.updateComment = async (comment) => {
    return await prisma.comment.create({
        where: {
            id: parseInt(comment.id)
        },
        data: { 
            postId: comment.postId,
            comment: comment.comment,
            updatedById: comment.updatedById,
            updatedAt: new Date()
        }
    })
}

exports.deleteCommentById = async(commentId) => {
    return await prisma.comment.delete({
        where: {
            id: parseInt(commentId)
        }
    })
}


//tags
exports.createTag = async (tag) => {
    return await prisma.tag.create({
        data: { 
            name: tag.name, 
            createdById: tag.createdById, 
            createdAt: new Date(),
            updatedAt: new Date(), 
            updatedById: tag.createdById
        }
    })
}
exports.findAllTags = async () => {
    return await prisma.tag.findMany();
}
exports.findTagById = async (tagId) => {
    return await prisma.tag.findUnique({
        where: {
            id: parseInt(tagId)
        }
    })
}
exports.updateTag = async (tag) => {
    return await prisma.tag.update({
        where: {
            id: parseInt(tag.id)
        },
        data: {
            name: tag.name,
            updatedAt: new Date(), 
            updatedById: tag.updatedById  
        }
    })
}

exports.deleteTagById = async (tagId) => {
    return await prisma.tag.delete({
        where: {
            id: parseInt(tagId)
        }
    })
}

exports.getPostCountByTag = async () => {
    try {
        const tags = await prisma.tag.findMany({
            select: {
                name: true, 
                id: true,
                _count: {
                    select: {
                        PostTag: true, // Count posts associated with the tag
                    },
                },
            },
        });

        const sortedTags = tags.sort((a, b) => b._count.PostTag - a._count.PostTag);

        return sortedTags;
    } catch (error) {
        console.error("Error fetching tags with post counts:", error);
        throw error;
    }
};
