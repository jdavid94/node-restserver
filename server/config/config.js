// ===========================
// Port
// ===========================
process.env.PORT = process.env.PORT || 3000;


// ===========================
// Environment
// ===========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===========================
// Expired Date 60 S - 60 M - 24h - 30days
// ===========================
process.env.CADUCATED_TOKEN = 60 * 60 * 24 * 30;

// ===========================
// SEED For authentication
// ===========================
process.env.SEED = process.env.SEED || 'seed-dev';

// ===========================
// Data Base
// ===========================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

// ===========================
// Google Client ID
// ===========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '446530260080-f3vakfc0pqmebioqrmn7j8lme9f4hflv.apps.googleusercontent.com';