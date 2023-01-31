const express = require("express");
const { Routes } = require("../config/constant");
const router = express.Router();
const controller = require("../controllers/user.controller");
const auth = require("../middleware/auth");
const utils = require("../utils/utils");

router.route(Routes.WHOAMI).get(auth.userBeOptional, controller.whoAmI);

router
    .route(Routes.ISUNIQUE)
    .get(controller.isUsernameUnique)
    .all(utils.notImplemented);

router.route("/all").get(controller.getAllUsers).all(utils.notImplemented);

router
    .use(auth.verifyUser)
    .route(Routes.BASE)
    .get(controller.getLoggedInUser)
    .put(controller.updateUserByID);

router.route(Routes.ID_PARAM).get(controller.getUserByID);
module.exports = router;
