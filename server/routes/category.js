const express = require('express');
let { verificatedToken, verificatedRole } = require('../config/middlewares/authentication');
const Category = require('../models/category');
let app = express();

//GET ALL CATEGORY
app.get('/category', verificatedToken, (req, res) => {
    // Solo traemos usuarios activos
    Category.find({ state: true }) //Definimos que queremos mostrar
        .sort('name') //Para ordenar
        .populate('user', 'name email') //Object ID en la categoria asociados.
        .exec((err, categories) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Category.count({ state: true }, (err, counts) => { // Contamos el total de la Coleccion
                res.json({
                    ok: true,
                    categories,
                    howMany: counts
                })
            })

        });
});

//GET CATEGORY BY ID
app.get('/category/:id', verificatedToken, (req, res) => {
    let id = req.params.id;
    Category.findById(id, { new: true, runValidators: true }, (err, categoryDB) => { //runValidators para evitar modificacions no deseadas
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Category ID not Found'
                }
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        });
    })
});

//CREATE NEW CATEGORY
app.post('/category', verificatedToken, (req, res) => {
    let body = req.body;
    let category = new Category({
        name: body.name,
        user: req.user.id
    });
    category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        })
    });
});

//UPDATED CATEGORY
app.put('/category/:id', verificatedToken, (req, res) => {
    let id = req.params.id;
    //Filtramos que se puede actualiazar del modelo.
    let body = (req.body); //Estos parametros se pueden actualizar
    let descName = {
        name: body.name
    }
    Category.findByIdAndUpdate(id, descName, { new: true, runValidators: true }, (err, categoryDB) => { //runValidators para evitar modificacions no deseadas
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        });
    })
});

//DELETEDCATEGORY
app.delete('/category/:id', [verificatedToken, verificatedRole], (req, res) => {
    let id = req.params.id; //GET THE ID BY URL
    let changeState = {
            state: false
        }
        //User.findByIdAndRemove(id, body, (err, userDelete) => { Eliminar Completamente
    Category.findByIdAndUpdate(id, changeState, { new: true }, (err, categoryDelete) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoryDelete) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Category ID not Found'
                }
            });
        }
        res.json({
            ok: true,
            category: categoryDelete
        })
    });
});


module.exports = app;