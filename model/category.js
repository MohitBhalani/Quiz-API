let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    }
})

let CATEGORY = mongoose.model('CATEGORY', categorySchema);
module.exports = CATEGORY;