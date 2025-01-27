let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userData = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
})

let USER = mongoose.model('USER', userData);
module.exports = USER;