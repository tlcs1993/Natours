const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json()); // Middleware that allows some properties on the request.

/* app.get('/', (req, res) => {
    res.status(200).json({message: 'Hello from the server side!', app: 'Natours'});
});

app.post('/', (req, res) => {
    res.status(200).send('You can post to this endpoint...');
}); */

// Read the file with the tours, converts to a javascript object and assign to the const 'tours'.
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours
        }
    })
});

app.post('/api/v1/tours', (req, res) => {
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
});

app.get('/api/v1/tours/:id', (req, res) => {
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
});

const port = 3000;

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});