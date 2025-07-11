const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

// * @desc Register user
// * @route GET /api/v1/auth/register
// * @access Public
const register = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role,
    });

    res.status(200).json({ success: true, data: user });
});

exports.register = register;
