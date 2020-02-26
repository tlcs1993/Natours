const Tour = require('./../models/tourModel');

// Check if the request's body contains the name and the price of the tour.
exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price',
        });
    }

    next();
};

// Retrieve all the tours.
exports.getAllTours = (req, res) => {
    console.log(`Request time: ${req.requestTime}`);

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        // results: tours.length,
        // data: {
        //     tours: tours,
        // },
    });
};

// Retrieve a specific tour based on the ID.
exports.getTour = (req, res) => {
    console.log(req.params);

    // Retrieve the parameter and save in the variable.
    //const id = req.params.id * 1; // Trick to convert a string (number-like) in a number.

    // Retrieve the tour contained in the tours array with the ID equal to the ID passed as an argument (req.params).
    /* const tour = tours.find((el) => el.id === id);

    res.status(200).json({
        status: 'success',
        data: {
            tours: tour,
        },
    }); */
};

// Create a new tour.
exports.createTour = (req, res) => {
    res.status(201).json({
        status: 'success',
        // data: {
        //     tour: newTour,
        // },
    });
};

// Change the values of a specific tour based on the ID.
exports.updateTour = (req, res) => {
    /* res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here!>',
        },
    }); */
};

// Delete a specific tour based on the ID.
exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null,
    });
};
