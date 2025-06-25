const express = require("express");
// * Load controller
const { getCourses, getCourse, addCourse, updateCourse, deleteCourse } = require("../controller/courses");

const router = express.Router({ mergeParams: true });

router.route("/").get(getCourses).post(addCourse);
router.route("/:id").get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
