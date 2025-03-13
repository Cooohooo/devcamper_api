const express = require("express");
const dotenv = require("dotenv");

// * Load env variables
dotenv.config({ path: "./config/config.env" });

const app = express();

// * Define PORT
const PORT = process.env.PORT || 8800;

// * Run server
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
