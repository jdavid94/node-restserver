require('./config/config'); //Call the cofig of port
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Configuracion global de rutas
app.use(require('./routes/index')); // Rutas de usuario


//Coneccion a DB Local
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;
    console.log('Data Base ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log('Listening in port ' + process.env.PORT);
})