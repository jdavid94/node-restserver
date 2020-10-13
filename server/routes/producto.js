const express = require('express');
const { verificatedToken } = require('../config/middlewares/authentication');
let app = express();
let Producto = require('../models/producto');


//======================
//Search Products
//======================
app.get('/productos/search/:termino', verificatedToken, (req, res) => {
    let term = req.params.termino
    let expression = new RegExp(term, 'i'); // Expresion regular, sin mayusculas
    Producto.find({ nombre: expression })
        .populate('category', 'name')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.status(201).json({
                ok: true,
                productos
            })
        })
});


//======================
//Get All Products
//======================
app.get('/productos', verificatedToken, (req, res) => {
    let from = req.query.from || 0; //Parametro Desde Paginacion, si no recibe nada empieza en 0
    let limite = req.query.limite || 5; //Parametro Hasta Paginacion
    limite = Number(limite);
    from = Number(from);
    Producto.find({ disponible: true }) //Definimos que queremos mostrar      
        .skip(from) // Next 5 register
        .limit(limite) //Paginacion    
        .populate('user', 'name email')
        .populate('category', 'name')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Producto.countDocuments({ disponible: true }, (err, counts) => { // Contamos el total de la Coleccion
                res.json({
                    ok: true,
                    productos,
                    howMany: counts
                })
            })

        });

});

//======================
//Get Product By Id
//======================
app.get('/productos/:id', verificatedToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id, { state: true }) //Definimos que queremos mostrar      
        .populate('user', 'name email')
        .populate('category', 'name')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID not Found'
                    }
                });
            }
            res.status(201).json({
                ok: true,
                productos
            })
        });
});

//======================
//Create product
//======================
app.post('/productos', verificatedToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({ //Formato en que debe venir el JSON
        user: req.user.id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        category: body.category
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    });
});

//======================
//Updated product
//======================
app.put('/productos/:id', verificatedToken, (req, res) => {
    //Update
    let id = req.params.id;
    let body = (req.body); // Estos parametros se pueden actualizar
    let modification = { // Campos que seran actualizados
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        category: body.category
    }
    Producto.findByIdAndUpdate(id, modification, { new: true, runValidators: true }, (err, productoDB) => { //runValidators para evitar modificacions no deseadas
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID not Found'
                }
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    })
});

//======================
//Delete product
//======================
app.delete('/productos/:id', verificatedToken, (req, res) => {
    let id = req.params.id; //GET THE ID BY URL
    let changeState = {
        disponible: false
    }
    Producto.findByIdAndUpdate(id, changeState, { new: true }, (err, productDelete) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productDelete) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product ID not Found'
                }
            });
        }
        res.json({
            ok: true,
            producto: productDelete
        })
    });
});

module.exports = app;