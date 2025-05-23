const {Router} = require("express"); 
const router = Router(); 
const controller = require("../controllers/postController");
const middleware = require("../middleware/user");


router.get("/getAllCounts", controller.getAllCounts);
router.get("/", middleware.verifyToken, controller.getAllPosts);
router.post("/", middleware.verifyToken, controller.createPost);
router.get("/:postId", middleware.verifyToken, controller.getPostById);
router.delete("/:postId", middleware.verifyToken, controller.deletePost);
router.put("/:postId", middleware.verifyToken, controller.updatePost);

router.get("/author/:authorId", middleware.verifyToken, controller.getPostByAuthor);
router.get("/tag/:tagId", middleware.verifyToken, controller.getPostByTag);

router.get("/:postId/Comments", controller.getCommentsByPost);
router.get("/:postId/Comments/:commentId",controller.getCommentById);
router.post("/:postId/Comments", controller.createComment);
router.delete("/:postId/Comments/:commentId", middleware.verifyToken, controller.deleteCommentById);
router.put("/:postId/Comments/:commentId", controller.updateCommentById);

router.get("/:postId/tags", controller.getTagsByPostId);

router.post("/publish/:postId", middleware.verifyToken, controller.publishPost); 
router.post("/unpublish/:postId", middleware.verifyToken, controller.unpublishPost); 

router.get("/public/publishedPosts/likeCount/:postId", controller.getPostLikeCount);
router.put("/public/publishedPosts/likeCount/:postId", controller.updatePostLikeCount);

router.get("/public/publishedPosts/search", controller.getPostSearchResults);
router.get("/public/publishedPosts/recent/:recentNumber", controller.getAllRecentPublishedPosts);
router.get("/public/publishedPosts/tag/:tagId", controller.getAllPublishedPostsByTag);
router.get("/public/publishedPosts", controller.getAllPublishedPosts);
router.get("/public/publishedPosts/:slug", controller.getAllPublishedPostsBySlug);




module.exports = router;