const monk = require('monk');

require('dotenv').config()
const connectionString = process.env.MONGODB_URI;

const db = monk(connectionString);

module.exports = db;


