const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/Bootcamp");

// * @desc Get all bootcamps
// * @route GET /api/v1/bootcamps
// * @access Public
const getAllBootcamps = asyncHandler(async (req, res) => {
	let query;
	// * Build query
	const reqQuery = { ...req.query };
	// * Remove fields from reqQuery that are not in queryStr
	const removeFields = ["select", "sort", "skip", "limit", "page"];
	removeFields.forEach((param) => delete reqQuery[param]);
	// * Create query string
	let queryStr = JSON.stringify(reqQuery);
	// * Create operators ($gt, $gte, etc)
	queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in|nin)\b/g, (match) => `$${match}`);
	// * Find resources
	query = Bootcamp.find(JSON.parse(queryStr));
	// * Select fields
	if (req.query.select) {
		query = query.select(req.query.select.split(",").join(" "));
	}
	// * Sort
	if (req.query.sort) {
		query = query.sort(req.query.sort.split(",").join(" "));
	} else {
		query = query.sort("-createdAt");
	}
	// * Pagination
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 10;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await Bootcamp.countDocuments();
	query = query.skip(startIndex).limit(limit);
	// * Execute query
	const bootcamps = await query;
	// * Pagination result
	const pagination = {};
	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit,
		};
	}
	if (startIndex > 0) {
		pagination.previous = {
			page: page - 1,
			limit,
		};
	}
	res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps, pagination });
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
				$centerSphere: [[lng, lat], radius],
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
