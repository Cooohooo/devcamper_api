const express = require("express");
// * Load controller
const {
    getAllBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload,
} = require("../controller/bootcamps");

const advancedResults = require("../middleware/advancedResults");
const Bootcamp = require("../models/Bootcamp");

// * Include other resource routers
const courseRouter = require("./courses");

const router = express.Router();

// * Include auth middleware
const { protect } = require("../middleware/auth");

router.route("/").get(advancedResults(Bootcamp, "courses"), getAllBootcamps).post(protect, createBootcamp);

router.route("/:id").get(getBootcamp).put(protect, updateBootcamp).delete(protect, deleteBootcamp);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router.route(":id/photo").put(protect, bootcampPhotoUpload);

// * Re-route into other resource routers
router.use(":bootcampId/courses", courseRouter);

module.exports = router;
