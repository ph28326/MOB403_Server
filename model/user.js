const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    fullName: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    }, 
    age: {
        type: String
    },
    gender:{
        type: String
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    image: {
        type: String
    }
});
const User = mongoose.model('User', userSchema);
module.exports = User;