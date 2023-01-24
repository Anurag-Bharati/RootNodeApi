const express = require("express");
const router = express.Router();
const controller = require("../controllers/connection.controller");
const utils = require("../utils/utils");
const auth = require("../middleware/auth");

// GET
router
    .route("/")
    .get(auth.verifyUser, controller.getAllConnections)
    .all(utils.notImplemented);

// Get Add Delete
router
    .route("/:uid")
    .get(auth.verifyUser, controller.hasConnection)
    .post(auth.verifyUser, controller.userConnectionToggler)
    .all(utils.notImplemented);

//  UPDATE
router
    .route("/update/:id")
    .put(auth.verifyUser, controller.updateConnectionById)
    .all(utils.notImplemented);

router;

module.exports = router;
