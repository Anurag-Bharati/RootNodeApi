const express = require("express");
const router = express.Router();
const controller = require("../controllers/post.controller");
const utils = require("../utils/utils");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

router
    .route("/")
    .get(controller.getAllPublicPost)
    .post(auth.verifyUser, upload.array("mediaFiles"), controller.createPost)
    .put(utils.notImplemented)
    .delete(auth.verifyUser, controller.deleteAllPost);

router
    .use(auth.verifyUser)
    .route("/:id")
    .get(controller.getPostById)
    .post(utils.notImplemented)
    .put(upload.array("mediaFiles"), controller.updatePostById)
    .delete(controller.deletePostById);

router
    .use(auth.verifyUser)
    .route("/:pid/likeunlike")
    .get(controller.getPostLiker)
    .post(controller.likeUnlikePost);

router
    .use(auth.verifyUser)
    .route("/:pid/comment")
    .get(controller.getComments)
    .post(controller.addComment)
    .put(utils.notImplemented)
    .delete(utils.notImplemented);

router
    .use(auth.verifyUser)
    .route("/comment/:cid")
    .get(controller.getCommentByID)
    .put(controller.updateCommentByID)
    .delete(controller.deleteCommentById);

router
    .use(auth.verifyUser)
    .route("/comment/:cid/likeunlike")
    .get(controller.getPostCommentLiker)
    .post(controller.likeUnlikeComment);

module.exports = router;
