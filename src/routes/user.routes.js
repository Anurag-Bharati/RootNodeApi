const express = require("express");
const { Routes } = require("../config/constant");
const router = express.Router();
const controller = require("../controllers/user.controller");
const auth = require("../middleware/auth");
const utils = require("../utils/utils");

router.route(Routes.WHOAMI).get(auth.checkUserOrAnonymous, controller.whoAmI);

router
    .route(Routes.ISUNIQUE)
    .get(controller.isUsernameUnique)
    .all(utils.notImplemented);

router.route(Routes.BASE).get(controller.getAllUsers).all(utils.notImplemented);

router
    .route(Routes.ID_PARAM)
    .get(controller.getUserByID)
    .put(controller.updateUserByID);

module.exports = router;
