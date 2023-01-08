const express = require("express");
const router = express.Router();
const controller = require("../controllers/post.controller");
const utils = require("../utils/utils");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

router
    .route("/")
    .get(controller.getAllPost)
    .post(upload.array("mediaFiles"), auth.verifyUser, controller.createPost)
    .put(utils.notImplemented)
    .delete(auth.verifyUser, controller.deleteAllPost);

router
    .use(auth.verifyUser)
    .route("/:id")
    .get(controller.getPostById) // TODO
    .post(utils.notImplemented)
    .put(controller.updatePostById) // TODO
    .delete(controller.deletePostById); // TODO

router
    .use(auth.verifyUser)
    .route("/:pid/likeunlike")
    .get(utils.notImplemented) // TODO GET POST LIKES W/ USER
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
    .get(utils.notImplemented) // TODO
    .put(utils.notImplemented) // TODO
    .delete(utils.notImplemented); // TODO

router
    .use(auth.verifyUser)
    .route("/comment/:cid/likeunlike")
    .get(utils.notImplemented) // TODO GET COMMENTS LIKES W/ USER
    .post(controller.likeUnlikeComment);

module.exports = router;
