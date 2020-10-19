const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const { verificatedTokenImg } = require('../config/middlewares/authentication');



app.get('/imagen/:tipo/:img', verificatedTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImage = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }
});

module.exports = app;