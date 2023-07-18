const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressHBS = require('express-handlebars');
const proController = require('./controllers/productController');
const usController = require('./controllers/userController');
const url = 'mongodb+srv://toantqkph28326:toantqkph28326@cluster0.pdvbfsv.mongodb.net/?retryWrites=true&w=majority';
//link mongodb demo

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json());
app.engine('.hbs', expressHBS.engine({ extname: '.hbs', defaultLayout: "main"}));
app.set('view engine', '.hbs');
app.use(express.json());
app.use(express.static('uploads'));
app.use(express.static('css')); 
app.use(express.static('js')); 

mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true});
app.use('/', proController);
app.use('/', usController);
app.listen(9999, ()=>{console.log('server is running')});
