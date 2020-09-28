const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validatedRole = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} not validate role'
}

let Schema = mongoose.Schema;

let userSchema = new Schema({ //Definimos el nuevo esquema
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        unique: true, // Indicamos UNICO
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: true
    },
    img: { // Not required
        type: String,
        required: false
    },
    role: { // default: 'USER_ROLE'
        type: String,
        default: 'USER_ROLE',
        enum: validatedRole
    },
    state: { // Boolean
        type: Boolean,
        default: true
    },
    google: { // Boolean
        type: Boolean,
        default: false
    }
});

//Para no retornar campos del password
userSchema.methods.toJSON = function() {
    let userTemp = this;
    let userObject = userTemp.toObject();
    delete userObject.password;
    return userObject;
}

userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

module.exports = mongoose.model('User', userSchema);