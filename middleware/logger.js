// * @desc Log request info
const logger = (req, res, next) => {
    console.log(
        `${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl} - ${new Date().toISOString()}`
    );
    next();
};

module.exports = logger;
