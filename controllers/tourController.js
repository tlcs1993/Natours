const Tour = require('./../models/tourModel');

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
        let queryStr = JSON.stringify(queryObj); // EXPLANATION: JSON.stringify is used to convert a javascript object in a JSON string.

        console.log(queryStr);

        // Replacing the third party operator using regular expressions so it can be used as a valid MongoDB operator (Ex.: gte -> $gte).
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`,
        );

        // EXPLANATION: JSON.parse is used to parse the data so it becomes a javascript object.

        let query = Tour.find(JSON.parse(queryStr)); // Saving the query result in a constant without executing it.

        /* 2. Sorting */

        if (req.query.sort) {
            // LEARNING: Syntax to sort by more than one criteria in Mongoose is 'sort(arg1 arg2)'. However in the the query string the arguments are splitted by a comma.

            const sortBy = req.query.sort.split(',').join(' ');

            query = query.sort(sortBy);
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
