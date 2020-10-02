const express = require('express');
const app = express();

//Todas las rutas de la APP
app.use(require('./user')); // Rutas de usuario
app.use(require('./login'));


module.exports = app;