/* eslint-disable no-unused-vars */
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); // Module that loads environment variables from a '.env' file.
const Tour = require('./../../models/tourModel');

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

// Read JSON file
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

// Import data into the database
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data succesfully loaded!');
        process.exit(); // Script to exit the process.
    } catch (err) {
        console.log(err);
    }
};

// Delete all data from the database
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data succesfully deleted!');
        process.exit(); // Script to exit the process.
    } catch (err) {
        console.log(err);
    }
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}

console.log(process.argv);
