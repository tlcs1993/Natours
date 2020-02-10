const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

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

// Mount the tour routes.
app.use('/api/v1/tours', tourRouter);

// Mount the user routes.
app.use('/api/v1/users', userRouter);

module.exports = app;