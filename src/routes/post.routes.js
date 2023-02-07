const express = require("express");
const router = express.Router();
const controller = require("../controllers/post.controller");
const utils = require("../utils/utils");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const { Routes } = require("../config/constant");

router
    .route(Routes.BASE)
    .get(auth.userBeOptional, controller.getAllPublicPost)
    .post(auth.verifyUser, upload.array("mediaFiles"), controller.createPost)
    .put(utils.notImplemented)
    .delete(auth.verifyUser, controller.deleteAllPost);

router
    .use(auth.verifyUser)
    .route("/user/:id")
    .get(controller.getPostByUser)
    .all(utils.notImplemented);

router.use(auth.verifyUser).route("/feed").get(controller.getMyFeed);

router
    .use(auth.verifyUser)
    .route(Routes.ID_PARAM)
    .get(controller.getPostById)
    .post(utils.notImplemented)
    .put(upload.array("mediaFiles"), controller.updatePostById)
    .delete(controller.deletePostById);

router
    .use(auth.verifyUser)
    .route(Routes.ID_LIKE)
    .get(controller.getPostLiker)
    .post(controller.likeUnlikePost);

router
    .use(auth.verifyUser)
    .route(Routes.POST_CMNT)
    .get(controller.getComments)
    .post(controller.addComment)
    .put(utils.notImplemented)
    .delete(utils.notImplemented);

router
    .use(auth.verifyUser)
    .route(Routes.CMT_WITH_ID)
    .get(controller.getCommentByID)
    .put(controller.updateCommentByID)
    .delete(controller.deleteCommentById);

router
    .use(auth.verifyUser)
    .route(Routes.CMNT_LIKE)
    .get(controller.getPostCommentLiker)
    .post(controller.likeUnlikeComment);

module.exports = router;
