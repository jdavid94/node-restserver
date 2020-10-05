const express = require('express');
const bcrypt = require('bcrypt'); //Encriptacion
const jwt = require('jsonwebtoken'); // TOKEN - se debe insalar npm
const User = require('../models/user');
const app = express(); // Para ocupar express
//Login google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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

//Google Config
async function verify(token) { //Regresa una promesa
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}


app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            })
        })
        //Cargar en DB
    User.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (userDB) {
            if (userDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Auth Normal Required'
                    }
                });
            } else {
                let token = jwt.sign({ // Generamos el Token
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.CADUCATED_TOKEN });
                return res.json({
                    ok: true,
                    user: userDB,
                    token
                });
            }
        } else {
            // If the user doesn't exist in DB
            let user = new User();
            user.name = googleUser.name,
                user.email = googleUser.email,
                user.img = googleUser.img,
                user.google = true;
            user.password = ':)';
            user.save((err, userDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };
                let token = jwt.sign({ // Generamos el Token
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.CADUCATED_TOKEN });
                return res.json({
                    ok: true,
                    user: userDB,
                    token
                });
            });
        }
    });
});

//Export
module.exports = app;