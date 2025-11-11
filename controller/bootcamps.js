const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/Bootcamp");

// * @desc Get all bootcamps
// * @route GET /api/v1/bootcamps
// * @access Public
const getAllBootcamps = asyncHandler(async (req, res) => {
    res.status(200).json(res.advancedResults);
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
    // * Add user to req.body
    req.body.user = req.user.id;
    // * Check for published bootcamp
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });
    // * If user is not an admin, they can only add one bootcamp
    if (publishedBootcamp && req.user.role !== "admin") {
        return next(new ErrorResponse("User already has a published bootcamp", 400));
    }
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
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    await bootcamp.remove();
    res.status(200).json({ success: true, data: {} });
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
                $centerSphere: [[lng, lat], radius],
            },
        },
    });
    res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
});

// * @desc Upload photo for bootcamp
// * @route PUT /api/v1/bootcamps/:id/photo
// * @access Private
const bootcampPhotoUpload = asyncHandler(async (req, res) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.file;

    // * Make sure the image is a photo
    if (!file.mimetype.startsWith("image")) {
        return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    // * Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(`Please upload an image file less than ${process.env.MAX_FILE_UPLOAD}`, 400)
        );
    }

    // * Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
        res.status(200).json({ success: true, data: file.name });
    });
});

module.exports = {
    getAllBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload,
};
