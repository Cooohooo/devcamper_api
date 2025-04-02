const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// * Load env variables
dotenv.config({ path: "./config/config.env" });

// * Connect to database
connectDB();

// * Load routes
const bootcamps = require("./routes/bootcamps");
const app = express();

// * Body parser
app.use(express.json());

// * Middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// * Mount routes
app.use("/api/v1/bootcamps", bootcamps);

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
