const {Router} = require("express"); 
const router = Router(); 
const controller = require("../controllers/postController");
const middleware = require("../middleware/user");

router.get("/", middleware.verifyToken, controller.getAllPosts);
router.post("/", middleware.verifyToken, controller.createPost);
router.get("/:postId", middleware.verifyToken, controller.getPostById);
router.delete("/:postId", middleware.verifyToken, controller.deletePost);
router.put("/:postId", middleware.verifyToken, controller.updatePost);

router.get("/author/:authorId", middleware.verifyToken, controller.getPostByAuthor);
router.get("/tag/:tagId", middleware.verifyToken, controller.getPostByTag);

router.get("/:postId/Comments/:commentId",controller.getCommentById);
router.post("/:postId/Comments", controller.createComment);
router.delete("/:postId/Comments/:commentId", controller.deleteCommentById);
router.put("/:postId/Comments/:commentId", controller.updateCommentById);

module.exports = router;