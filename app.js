const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

/* ********** MIDDLEWARES ********** */

// Middleware that allows some properties on the request.
app.use(express.json());

// HTTP request logger middleware for node.js.
app.use(morgan('dev'));

// Logs a message each time the app has made a requisition. Only for demonstration purpose.
app.use((req, res, next) => {
    console.log('Hello from the middleware!');
    next();
});

// Create a variable in the req property to save the time of each request.
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// Read the file with the tours, converts to a javascript object and assign to the const 'tours'.
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

/* ********** ROUTE HANDLERS ********** */

/* Tours Route Handlers */

const getAllTours = (req, res) => {
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

const getTour = (req, res) => {
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

const createTour = (req, res) => {
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

const updateTour = (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here!>'
        }
    });
};

const deleteTour = (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
};

/* Users Route Handlers */

const getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    });
};

const getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    });
};

const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    });
};

const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    });
};

const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    });
};

/* ********** ROUTES ********** */

const tourRouter = express.Router();
const userRouter = express.Router();

/* Tour Routes */

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

tourRouter.route('/')
.get(getAllTours)
.post(createTour);

tourRouter.route('/:id')
.get(getTour)
.patch(updateTour)
.delete(deleteTour);

/* User Routes */

// app.get('/api/v1/users', getAllUsers);
// app.get('/api/v1/users/:id', getUser);
// app.post('/api/v1/users', createUser);
// app.patch('/api/v1/users/:id', updateUser);
// app.delete('/api/v1/users/:id', deleteUser);

userRouter.route('/')
.get(getAllUsers)
.post(createUser);

userRouter.route('/:id')
.get(getUser)
.patch(updateUser)
.delete(deleteUser);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

/* ********** SERVER STARTING CONFIG ********** */

const port = 3000;

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});