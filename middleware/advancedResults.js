const advancedResults = (model, populate) => async (req, res, next) => {
    let query;
    // * Build query
    const reqQuery = { ...req.query };
    // * Remove fields from reqQuery that are not in queryStr
    const removeFields = ["select", "sort", "skip", "limit", "page"];
    removeFields.forEach((param) => delete reqQuery[param]);
    // * Create query string
    let queryStr = JSON.stringify(reqQuery);
    // * Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in|nin)\b/g, (match) => `$${match}`);
    // * Find resources
    query = model.find(JSON.parse(queryStr));
    // * Select fields
    if (req.query.select) {
        query = query.select(req.query.select.split(",").join(" "));
    }
    // * Sort
    if (req.query.sort) {
        query = query.sort(req.query.sort.split(",").join(" "));
    } else {
        query = query.sort("-createdAt");
    }
    // * Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();
    query = query.skip(startIndex).limit(limit);

    if (populate) {
        query = query.populate(populate);
    }

    // * Execute query
    const results = await query;

    // * Pagination result
    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }
    if (startIndex > 0) {
        pagination.previous = {
            page: page - 1,
            limit,
        };
    }

    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results,
    };
    next();
};

module.exports = advancedResults;
