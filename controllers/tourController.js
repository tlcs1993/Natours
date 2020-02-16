const fs = require('fs');

// Read the file with the tours, converts to a javascript object and assign to the const 'tours'.
const tours = JSON.parse(fs.readFileSync(`${ __dirname }/../dev-data/data/tours-simple.json`));

// Check the ID automaticly.
exports.checkID = (req, res, next, val) => {
    console.log(`Tour id is: ${ val }`);

    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    next();
};

// Check if the request's body contains the name and the price of the tour.
exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price'
        });
    }

    next();
};

// Retrieve all the tours.
exports.getAllTours = (req, res) => {
    console.log('Request time: ' + req.requestTime);

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours: tours
        }
    });
};

// Retrieve a specific tour based on the ID.
exports.getTour = (req, res) => {
    console.log(req.params);

    // Recebe o parâmetro e guarda na variável.
    const id = req.params.id * 1; // Truque para converter uma string (number-like) em um número.

    // Recebe a tour contida no array das tours cujo ID seja igual ao ID passado por parâmetro (req.params).
    const tour = tours.find(el => el.id === id);

    // if (id > tours.length) {
    if (!tour) {
        return res.status(404).json({
            status: 'failed',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tours: tour
        }
    });
};

// Create a new tour.
exports.createTour = (req, res) => {
    // console.log(req.body);
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);

    fs.writeFile(`${ __dirname }/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });
};

// Change the values of a specific tour.
exports.updateTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here!>'
        }
    });
};

// Delete an specific tour based on the ID.
exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null
    });
};