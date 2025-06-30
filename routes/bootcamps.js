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

// * Include other resource routers
const courseRouter = require("./courses");

const router = express.Router();

router.route("/").get(getAllBootcamps).post(createBootcamp);
router.route("/:id").get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
router.route(":id/photo").put(bootcampPhotoUpload);

// * Re-route into other resource routers
router.use(":bootcampId/courses", courseRouter);

module.exports = router;
