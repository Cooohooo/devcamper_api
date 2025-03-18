const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

// * Load env variables
dotenv.config({ path: "./config/config.env" });

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
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
