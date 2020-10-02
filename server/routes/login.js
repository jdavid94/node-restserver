const express = require('express');
const bcrypt = require('bcrypt'); //Encriptacion
const jwt = require('jsonwebtoken'); // TOKEN - se debe insalar npm
const User = require('../models/user');
const app = express(); // Para ocupar express


app.post('/login', (req, res) => {
    let body = req.body; // Correo and password from the user
    User.findOne({ email: body.email }, (err, userDB) => { //findOne busca un unico registro
        //Mostramos cualquier tipo de error
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!userDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: '(User) and Password Incorrect'
                }
            });
        }
        if (!bcrypt.compareSync(body.password, userDB.password)) { //Comparamos ambos password, siempre encriptados
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'User and (Password) Incorrect'
                }
            });
        }
        let token = jwt.sign({ // Generamos el Token
            user: userDB
        }, process.env.SEED, { expiresIn: process.env.CADUCATED_TOKEN });
        res.json({
            ok: true,
            user: userDB,
            token
        })
    });
});











//Export
module.exports = app;