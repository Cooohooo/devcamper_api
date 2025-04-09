const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
        unique: true,
        trim: true,
        maxlength: [50, "Name cannot be more than 50 characters"],
    },
    slug: String,
    description: {
        type: String,
        required: [true, "Please add a description"],
        maxlength: [500, "Description cannot be more than 500 characters"],
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            "Please use a valid URL with HTTP or HTTPS",
        ],
    },
    phone: {
        type: String,
        maxlength: [20, "Phone number cannot be more than 20 characters"],
    },
    email: {
        type: String,
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please add a valid email",
        ],
    },
    address: {
        type: String,
        required: [true, "Please add an address"],
    },
    location: {
        // * GeoJson Point
        type: {
            type: String,
            enum: ["Point"],
        },
        coordinates: {
            type: [Number],
            index: "2dsphere",
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
    },
    careers: {
        // * Array of careers
        type: [String],
        enum: ["Web Development", "Mobile Development", "UI/UX", "Data Science", "Business", "Other"],
    },
    averageRating: {
        type: Number,
        min: [0, "Rating cannot be less than 0"],
        max: [10, "Rating cannot be more than 10"],
    },
    averageCost: Number,
    photo: {
        type: String,
        default: "no-photo.jpg",
    },
    housing: {
        type: Boolean,
        default: false,
    },
    jobAssistance: {
        type: Boolean,
        default: false,
    },
    jobGuarantee: {
        type: Boolean,
        default: false,
    },
    acceptGi: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// * Create bootcamp slug from name
BootcampSchema.pre("save", async function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// * Geocode and create location field
BootcampSchema.pre("save", async function (next) {
    const location = await geocoder.geocode(this.address);
    this.location = {
        type: "Point",
        coordinates: [location[0].longitude, location[0].latitude],
        formattedAddress: location[0].formattedAddress,
        street: location[0].streetName,
        city: location[0].city,
        state: location[0].stateCode,
        zipcode: location[0].zipcode,
        country: location[0].countryCode,
    };
    this.address = location[0].formattedAddress;
    next();
});

module.exports = mongoose.model("Bootcamp", BootcampSchema);
