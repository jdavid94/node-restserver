const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const User = require('../models/user');
const Producto = require('../models/producto');
const fs = require('fs'); //Importamos el File System
const path = require('path'); // Creamos ruta

//Default Options 
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No files were uploaded.'
            }
        });
    }
    // Validated Tipo
    let tiposValidated = ['products', 'users'];
    if (tiposValidated.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Tipos must be ' + tiposValidated.join(', ')
            }
        })
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
    let fileName = sampleFile.name.split('.');
    let extension = fileName[fileName.length - 1];

    // Extenssion Permit
    let extenssionValidated = ['png', 'jpg', 'gif', 'jpeg'];

    if (extenssionValidated.indexOf(extension) < 0) { // Valimos la extension del archivo
        return res.status(400).json({
            ok: false,
            err: {
                message: 'File must be ' + extenssionValidated.join(', '),
                ext: extension

            }
        })
    }

    //Change Files Name
    let nameTemp = `${id}-${new Date().getMilliseconds()}.${extension}`;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(`uploads/${tipo}/${nameTemp}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        // Image Uploaded
        if (tipo != 'users') {
            productImage(id, res, nameTemp);
        } else {
            userImage(id, res, nameTemp);
        }
    });
});

function userImage(id, res, nameTemp) {
    User.findById(id, (err, userDB) => {
        if (err) {
            deleteFile(nameTemp, 'users'); //Borramos Imagen Subida
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!userDB) {
            deleteFile(nameTemp, 'users'); //Borramos Imagen Subida
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not Found'
                }
            });
        }

        deleteFile(userDB.img, 'users');

        userDB.img = nameTemp;
        userDB.save((err, userSave) => {
            res.json({
                ok: true,
                user: userSave,
                img: nameTemp
            })
        })

    })
}

function productImage(id, res, nameTemp) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            deleteFile(nameTemp, 'products'); //Borramos Imagen Subida
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            deleteFile(nameTemp, 'products'); //Borramos Imagen Subida
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not Found'
                }
            });
        }

        deleteFile(productoDB.img, 'products');

        productoDB.img = nameTemp;
        productoDB.save((err, productSave) => {
            res.json({
                ok: true,
                product: productSave,
                img: nameTemp
            })
        })

    })
}

function deleteFile(imageName, tipo) {
    //Validamos si existe la imagen
    let pathImage = path.resolve(__dirname, `../../uploads/${tipo}/${imageName}`);
    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
    }
}

module.exports = app;