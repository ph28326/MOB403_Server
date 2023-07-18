const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: {
        type: String
    },
    brand: {
        type: String
    },
    category: {
        type: String
    },
    price0: {
        type: String
    },
    price1: {
        type: String
    },
    image: {
        type: String
    },
    description: {
        type: String
    }
});
const Product = mongoose.model('Product', productSchema);
module.exports = Product;