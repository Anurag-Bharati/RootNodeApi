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
    .delete(controller.deleteAllPost);

router
    .use(auth.verifyUser)
    .route("/:id")
    .get(controller.getPostById)
    .post(utils.notImplemented)
    .put(controller.updatePostById)
    .delete(controller.deletePostById);

router
    .use(auth.verifyUser)
    .route("/:pid/likeunlike")
    .post(controller.likeUnlikePost);

module.exports = router;
