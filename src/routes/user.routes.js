const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const utils = require("../utils/utils");
const auth = require("../middleware/auth");

router
    .route("/register")
    .get(utils.notImplemented)
    .post(controller.register)
    .put(utils.notImplemented)
    .delete(utils.notImplemented);

router
    .route("/whoami")
    .get(auth.checkUserOrAnonymous, controller.whoAmI)
    .post(utils.notImplemented)
    .put(utils.notImplemented)
    .delete(utils.notImplemented);

router
    .route("/login")
    .get(utils.notImplemented)
    .post(controller.login)
    .put(utils.notImplemented)
    .delete(utils.notImplemented);

router
    .route("/:id")
    .get(controller.getUserByID)
    .put(controller.updateUserByID)
    .post(utils.notImplemented);

module.exports = router;
