const mongoose = require('mongoose');

// Create the tour schema.
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
    },
    rating: {
        type: Number,
        default: 4.5,
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price'],
    },
});

// Create the tour model.
const Tour = mongoose.model('Tour', tourSchema);

// Exports the model.
module.exports = Tour;
