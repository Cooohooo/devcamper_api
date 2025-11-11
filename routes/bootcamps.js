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
const { protect, authorize } = require("../middleware/auth");

// * Re-route into other resource routers
router.use(":bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router.route(":id/photo").put(protect, authorize("publisher", "admin"), bootcampPhotoUpload);

router
    .route("/")
    .get(advancedResults(Bootcamp, "courses"), getAllBootcamps)
    .post(protect, authorize("publisher", "admin"), createBootcamp);

router
    .route("/:id")
    .get(getBootcamp)
    .put(protect, authorize("publisher", "admin"), updateBootcamp)
    .delete(protect, authorize("publisher", "admin"), deleteBootcamp);

module.exports = router;
