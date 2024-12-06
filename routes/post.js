const {Router} = require("express"); 
const router = Router(); 
const controller = require("../controllers/postController");

router.post("/", controller.createPost);
router.get("/:postId", controller.getPostById);
router.delete("/:postId", controller.deletePost);
router.put("/:postId", controller.updatePost);

router.get("/author/:authorId", controller.getPostByAuthor);
router.get("/tag/:tagId", controller.getPostByTag);

router.get("/:postId/Comments/:commentId", controller.getCommentById);
router.post("/:postId/Comments", controller.createComment);
router.delete("/:postId/Comments/:commentId", controller.deleteCommentById);
router.put("/:postId/Comments/:commentId", controller.updateCommentById);

module.exports = router;