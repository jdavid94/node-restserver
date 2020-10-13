const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let categorySchema = new Schema({
    name: { type: String, unique: true, required: [true, 'Must be Obligatory'] },
    user: { type: Schema.Types.ObjectId, ref: 'User', default: '5f5114d3c3f3d708b84fcb7f' },
    state: {
        type: Boolean,
        default: true
    }
});


module.exports = mongoose.model('Category', categorySchema);