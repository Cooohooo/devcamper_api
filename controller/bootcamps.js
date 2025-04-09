const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/Bootcamp");

// * @desc Get all bootcamps
// * @route GET /api/v1/bootcamps
// * @access Public
const getAllBootcamps = asyncHandler(async (req, res) => {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
});

// * @desc Get single bootcamp
// * @route GET /api/v1/bootcamps/:id
// * @access Public
const getBootcamp = asyncHandler(async (req, res) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: bootcamp });
});

// * @desc Create new bootcamp
// * @route POST /api/v1/bootcamps
// * @access Private
const createBootcamp = asyncHandler(async (req, res) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(200).json({ success: true, data: bootcamp });
});

// * @desc Update bootcamp
// * @route PUT /api/v1/bootcamps/:id
// * @access Private
const updateBootcamp = asyncHandler(async (req, res) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: bootcamp });
});

// * @desc Delete bootcamp
// * @route DELETE /api/v1/bootcamps/:id
// * @access Private
const deleteBootcamp = asyncHandler(async (req, res) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: bootcamp });
});

// * @desc Get bootcamp within a radius
// * @route GET /api/v1/bootcamps/radius/:zipcode/:distance
// * @access Private
const getBootcampsInRadius = asyncHandler(async (req, res) => {
    const { zipcode, distance } = req.params;
    const location = await geocoder.geocode(zipcode);
    const lat = location[0].latitude;
    const lng = location[0].longitude;
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: {
                $centerSphere: [
                    [lng, lat],
                    radius,
                ],
            },
        },
    });
    res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
});

module.exports = {
    getAllBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
};
