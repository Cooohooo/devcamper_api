const fs = require("fs");
const colors = require("colors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// * Load env variables
dotenv.config({ path: "./config/config.env" });

// * Load models
const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");

// * Connect to database
mongoose.connect(process.env.MONGO_URI);

// * Read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8"));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8"));

// * Import into DB
const importData = async () => {
	try {
		await Bootcamp.create(bootcamps);
		await Course.create(courses);
		console.log("Data imported successfully".green.inverse);
		process.exit(0);
	} catch (error) {
		console.log(error.message.red.inverse);
		process.exit(1);
	}
};

// * Delete from DB
const deleteData = async () => {
	try {
		await Bootcamp.deleteMany();
		await Course.deleteMany();
		console.log("Data deleted successfully".green.inverse);
		process.exit(0);
	} catch (error) {
		console.log(error.message.red.inverse);
		process.exit(1);
	}
};

if (process.argv[2] === "-i") {
	importData();
} else if (process.argv[2] === "-d") {
	deleteData();
}
