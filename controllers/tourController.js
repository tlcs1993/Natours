const Tour = require('./../models/tourModel');

// Aliasing middleware to the five best cheapest tours.
exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

// Retrieve all the tours.
exports.getAllTours = async (req, res) => {
    try {
        console.log(req.query);

        /***** BUILDING THE QUERY *****/

        /* 1.1. Filtering */
        const queryObj = { ...req.query }; // Hard copying (Uses destructuring) the content of the query without keeping the reference to the original object.
        const excludedFiles = ['page', 'sort', 'limit', 'fields']; // String of names to be ignored from the query.
        excludedFiles.forEach((el) => delete queryObj[el]); // Delete the fields from the 'queryObj' wich the name is in the 'excludedFiles' string.

        /* 1.2. Advanced filtering */
        let queryStr = JSON.stringify(queryObj);

        // USED FOR WHAT: JSON.stringify is used to convert a javascript object in a JSON string.

        console.log(queryStr);

        // Replacing the third party operator using regular expressions so it can be used as a valid MongoDB operator (Ex.: gte -> $gte).
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`,
        );

        // USED FOR WHAT: JSON.parse is used to parse the data so it becomes a javascript object.

        let query = Tour.find(JSON.parse(queryStr)); // Saving the query result in a constant without executing it.

        /* 2. Sorting */

        if (req.query.sort) {
            // Syntax to sort by more than one criteria in Mongoose is 'sort(arg1 arg2)'. However in the the query string the arguments are splitted by a comma.
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt'); // Default sorting criteria.
        }

        /* 3. Limiting fields */
        if (req.query.fields) {
            const fields = req.query.fields.split(',');
            query = query.select(fields);
        } else {
            // Select everything except the field '__v' from the MongoDB object. It has internal use only then isn't needed.
            query = query.select('-__v');
        }

        /* 4. Pagination */

        // Set the default starting page.
        const page = req.query.page * 1 || 1;

        // Set the limit of items by page.
        const limit = req.query.limit * 1 || 100;

        // Set the items who should not be showed in the chosen page because it may belong in previous pages.
        const skip = (page - 1) * limit;

        // Skip the items before the ones to be shown in the chosen page and set the number of documents by page.
        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            // Return a promise with the number of documents.
            const numTour = await Tour.countDocuments();

            // Check if the number of documents skipped are greater or equal than the number of the documents wich means that the page does not exist.
            if (skip >= numTour) {
                throw new Error('This page does not exist');
            }
        }

        /***** EXECUTING THE QUERY *****/

        const tours = await query;

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
