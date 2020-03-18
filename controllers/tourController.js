const Tour = require('./../models/tourModel');

// Aliasing middleware to the five best cheapest tours.
exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    /* Filtering */

    filter() {
        // Hard copying (Uses destructuring) the content of the query without keeping the reference to the original object.
        const queryObj = { ...this.queryString };

        // String of names to be ignored from the query.
        const excludedFiles = ['page', 'sort', 'limit', 'fields'];

        // Delete the fields from the 'queryObj' wich the name is in the 'excludedFiles' string.
        excludedFiles.forEach((el) => delete queryObj[el]);

        // Converting a javascript object to a JSON string.
        let queryStr = JSON.stringify(queryObj);

        // Replacing the third party operator using regular expressions so it can be used as a valid MongoDB operator (Ex.: gte -> $gte).
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`,
        );

        // Saving the query result in a constant without executing it.
        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    /* 2. Sorting */

    sort() {
        // In case there some sorting defined in the query string.
        if (this.queryString.sort) {
            // Syntax to sort by more than one criteria in Mongoose is 'sort(arg1 arg2)'. However in the the query string the arguments are splitted by a comma.
            const sortBy = this.queryString.sort.split(',').join(' ');

            //Atribute to the query the query string sorted.
            this.query = this.query.sort(sortBy);
        } else {
            // Default sorting criteria. Sort by time of creation in decreasing order.
            this.query = this.query.sort('-createdAt'); 
        }

        return this;
    }

    /* 3. Limiting fields */

    limitFields() {
        if (this.queryString.fields) {
            // Split the fields in the query string by the comma.
            const fields = this.queryString.fields.split(',');

            //Select the fields in the query string chosen by the user.
            this.query = this.query.select(fields);
        } else {
            // Select everything except the field '__v' from the MongoDB object. It has internal use only then isn't needed.
            this.query = this.query.select('-__v');
        }

        return this;
    }

    /* 4. Pagination */

    paginate() {
        // Set the default starting page.
        const page = this.queryString.page * 1 || 1;

        // Set the limit of items by page.
        const limit = this.queryString.limit * 1 || 100;

        // Set the items who should not be showed in the chosen page because it may belong in previous pages.
        const skip = (page - 1) * limit;

        // Skip the items before the ones to be shown in the chosen page and set the number of documents by page.
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

// Retrieve all the tours.
exports.getAllTours = async (req, res) => {
    try {
        console.log(req.query);

        /***** BUILDING THE QUERY *****/

        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        /***** EXECUTING THE QUERY *****/

        const tours = await features.query;

        /* Sending a response */

        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours: tours,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

// Retrieve a specific tour based on the ID.
exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id); // Same thing as 'Tour.findOne({ _id: req.params.id })'.

        res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

// Create a new tour.
exports.createTour = async (req, res) => {
    try {
        // const newTour({});
        // newTour.save();
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
};

// Change the values of a specific tour based on the ID.
exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the new document.
            runValidators: true,
        });

        res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

// Delete a specific tour based on the ID.
exports.deleteTour = async (req, res) => {
    try {
        // Delete operations in a REST API don't save the content in a variable because there is no need to send data to the client.
        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};
