const dotenv = require('dotenv'); // Module that loads environment variables from a '.env' file.

// Loads the variables from the '.env' file contained in the path.
dotenv.config({ path: './config.env' });

const app = require('./app');

// Show all the process environment variables.
// console.log(process.env);

// Choose the port set on the 'config.env' file or the default 3000.
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App running on port ${ port }...`);
});