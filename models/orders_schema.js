const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const postSchema = new Schema({
    name: String,
    amount: Number,
    cost: Number,
    address: String,
    status: String,
    time: String,
    userId: String,
    cartId: String,
    email: String
})

module.exports = mongoose.model('order', postSchema);

