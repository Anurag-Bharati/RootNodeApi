const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const utils = require("../utils/utils");
const auth = require("../middleware/auth");

router.route("/register").post(controller.register).all(utils.notImplemented);

router
    .route("/whoami")
    .get(auth.checkUserOrAnonymous, controller.whoAmI)
    .all(utils.notImplemented);

router.route("/login").post(controller.login).all(utils.notImplemented);

router.route("/").get(controller.getAllUsers).all(utils.notImplemented);

router
    .route("/:id")
    .get(controller.getUserByID)
    .put(controller.updateUserByID)
    .all(utils.notImplemented);

module.exports = router;
