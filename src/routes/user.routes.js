const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const auth = require("../middleware/auth");

router.route("/whoami").get(auth.checkUserOrAnonymous, controller.whoAmI);
router.route("/:id").get(controller.getUserByID).put(controller.updateUserByID);
router.route("/").get(controller.getAllUsers).all(utils.notImplemented);

module.exports = router;
