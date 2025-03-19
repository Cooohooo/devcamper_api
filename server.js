const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");

// * Load env variables
dotenv.config({ path: "./config/config.env" });

// * Connect to database
connectDB();

// * Load routes
const bootcamps = require("./routes/bootcamps");
const app = express();

// * Middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// * Mount routes
app.use("/api/v1/bootcamps", bootcamps);

// * Define PORT
const PORT = process.env.PORT || 8800;

// * Run server
const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// * Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    // * Close server & exit process
    server.close(() => process.exit(1));
});
