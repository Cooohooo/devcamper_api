const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileupload = require("express-fileupload");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");
const path = require("path");

// * Load env variables
dotenv.config({ path: "./config/config.env" });

// * Connect to database
connectDB();

// * Load routes
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const app = express();

// * Body parser
app.use(express.json());

// * File upload
app.use(fileupload());

// * Set static folder
app.use(express.static(path.join(__dirname, "public")));

// * Middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// * Mount routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);

// * Error handler middleware
app.use(errorHandler);

// * Define PORT
const PORT = process.env.PORT || 8800;

// * Run server
const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});

// * Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`.red.bold);
    // * Close server & exit process
    server.close(() => process.exit(1));
});
