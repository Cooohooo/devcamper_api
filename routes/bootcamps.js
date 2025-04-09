const express = require("express");
// * Load controller
const {
    getAllBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
} = require("../controller/bootcamps");

const router = express.Router();

router.route("/").get(getAllBootcamps).post(createBootcamp);
router.route("/:id").get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

module.exports = router;
