const express = require("express");
const { Routes } = require("../config/constant");
const router = express.Router();
const controller = require("../controllers/user.controller");
const auth = require("../middleware/auth");
const utils = require("../utils/utils");
const upload = require("../middleware/upload");

router.route(Routes.WHOAMI).get(auth.userBeOptional, controller.whoAmI);

router
    .route(Routes.ISUNIQUE)
    .get(controller.isUsernameUnique)
    .all(utils.notImplemented);

router.route("/all").get(controller.getAllUsers).all(utils.notImplemented);

// data may get scrapped so throttle or ban user if scraping.
router.route(Routes.ID_PARAM).get(auth.verifyUser, controller.getUserByID);

router
    .use(auth.verifyUser)
    .route(Routes.BASE)
    .get(controller.getLoggedInUser)
    .put(upload.single("profile"), controller.updateUserByID);

module.exports = router;
