const mongoose = require('mongoose');
const dotenv = require('dotenv'); // Module that loads environment variables from a '.env' file.
const app = require('./app');

// Loads the variables from the '.env' file contained in the path.
dotenv.config({ path: './config.env' });

// Replaces the password area on the database connection string with the real password. Both are in the variables file.
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD,
);

// Connect the database.
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Database connection successful!'));

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

// Show all the process environment variables.
// console.log(process.env);

// Choose the port set on the 'config.env' file or the default 3000.
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
