const express = require('express');
const bcrypt = require('bcrypt'); //Encriptacion
const _ = require('underscore'); // Funcionalidades
const User = require('../models/user');
const { verificatedToken, verificatedRole } = require('../config/middlewares/authentication');
const app = express();


//Get All the users
app.get('/user', verificatedToken, function(req, res) {
    let from = req.query.from || 0; //Parametro Desde Paginacion, si no recibe nada empieza en 0
    let limite = req.query.limite || 5; //Parametro Hasta Paginacion
    limite = Number(limite);
    from = Number(from);
    // Solo traemos usuarios activos
    User.find({ state: true }, 'name email role state google img') //Definimos que queremos mostrar
        .skip(from) // Next 5 register
        .limit(limite) //Paginacion
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            User.count({ state: true }, (err, counts) => { // Contamos el total de la Coleccion
                res.json({
                    ok: true,
                    users,
                    howMany: counts
                })
            })

        });
})

//Create
app.post('/user', [verificatedToken, verificatedRole], function(req, res) {
    let body = req.body;
    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), //Encriptacion
        role: body.role
    });
    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //userDB.password = null;
        res.json({
            ok: true,
            user: userDB
        })
    });
})

//Update
app.put('/user/:id', [verificatedToken, verificatedRole], function(req, res) {
    let id = req.params.id;
    //Filtramos que se puede actualiazar del modelo.
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']); //Estos parametros se pueden actualizar
    //delete body.password
    //delete body.google
    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => { //runValidators para evitar modificacions no deseadas
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            user: userDB
        });
    })

})

//Delete USERS
app.delete('/user/:id', [verificatedToken, verificatedRole], function(req, res) {
    let id = req.params.id; //GET THE ID BY URL
    //let body = _.pick(req.body);
    //body.state = false;
    let changeState = {
            state: false
        }
        //User.findByIdAndRemove(id, body, (err, userDelete) => { Eliminar Completamente
    User.findByIdAndUpdate(id, changeState, { new: true }, (err, userDelete) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!userDelete) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not Found'
                }
            });
        }
        res.json({
            ok: true,
            user: userDelete
        })
    });
})

//Export
module.exports = app;