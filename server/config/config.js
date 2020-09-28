// ===========================
// Port
// ===========================
process.env.PORT = process.env.PORT || 3000;


// ===========================
// Environment
// ===========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
// ===========================
// Data Base
// ===========================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffe';
} else {
    urlDB = 'mongodb+srv://strider:tm38wpK2W1VVfPk7@cluster1.lqnm9.mongodb.net/coffe';
}
process.env.URLDB = urlDB;