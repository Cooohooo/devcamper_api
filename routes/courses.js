const express = require("express");
// * Load controller
const { getCourses } = require("../controller/courses");

const router = express.Router({ mergeParams: true });

router.route("/").get(getCourses);

module.exports = router;
