// * @desc Get all bootcamps
// * @route GET /api/v1/bootcamps
// * @access Public
const getAllBootcamps = (req, res) => {
    res.status(200).json({ success: true, data: { msg: "Get all bootcamps" } });
};

// * @desc Get single bootcamp
// * @route GET /api/v1/bootcamps/:id
// * @access Public
const getBootcamp = (req, res) => {
    res.status(200).json({ success: true, data: { msg: `Get bootcamp ${req.params.id}` } });
};

// * @desc Create new bootcamp
// * @route POST /api/v1/bootcamps
// * @access Private
const createBootcamp = (req, res) => {
    res.status(200).json({ success: true, data: { msg: "Create new bootcamp" } });
};

// * @desc Update bootcamp
// * @route PUT /api/v1/bootcamps/:id
// * @access Private
const updateBootcamp = (req, res) => {
    res.status(200).json({ success: true, data: { msg: `Update bootcamp ${req.params.id}` } });
};

// * @desc Delete bootcamp
// * @route DELETE /api/v1/bootcamps/:id
// * @access Private
const deleteBootcamp = (req, res) => {
    res.status(200).json({ success: true, data: { msg: `Delete bootcamp ${req.params.id}` } });
};

module.exports = {
    getAllBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp
};
