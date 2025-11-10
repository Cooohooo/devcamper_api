const express = require("express");
const { register } = require("../controller/auth");
const { login } = require("../controller/auth");
const { getMe } = require("../controller/auth");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/me").get(protect, getMe);

module.exports = router;
