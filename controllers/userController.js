const express = require('express');
const usModel = require('../model/user');
var multer = require('multer');
var bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended:true}))

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        if(file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png'){
            cb(null, 'uploads/images/users');
        }else{
            cb(new Error('not image'), null);
        }
        
    },
    filename: function(req, file, cb){
        cb(null, Date.now()+'.jpg');
    }
})

var upload = multer({storage: storage});

app.get('/add-user', (req,res) => {
    res.render('users/add.hbs',{
        viewTitle: 'THÊM NGƯỜI DÙNG MỚI'
    });
});


app.get('/json/list-user', (req,res) => {
    usModel.find({}).then(users => {
        res.json(users);
    })
});

app.get('/json/detail-user', (req,res) => {
    console.log("-->get detail: ",req.query.id)
    usModel.findById(req.query.id , (err, us) => {
        if(!err){
            res.json(us);
        }
        
    })
    
    
});
app.get('/list-user', (req,res) => {
    console.log("-->get list user")
    usModel.find({}).then(users => {
        res.render('users/list.hbs',{
            viewTitle: 'LIST USER',
            users: users.map(user => user.toJSON())
        });
    })
    
});


app.post('/add-user', upload.single('image'), async(req, res)=>{
    if(req.body.id == ''){
        AddRecord(req, res);
    }else{
        updateRecordUS(req, res);
    }
});



function AddRecord(req, res){
    var img = "null";
    try {
        img = req.file.filename;
    } catch (error) {
        
    }
    const us = new usModel({
        fullName : req.body.fullName,
        email : req.body.email,
        password : req.body.password,
        age : req.body.age,
        gender : req.body.gender,
        phone : req.body.phone,
        address : req.body.address,
        image : img,
    });
    try {
        us.save();
        res.redirect('/list-user');
    } catch (error) {
        res.status(500).send(error);
    }
}

function updateRecordUS(req, res){
    usModel.findOneAndUpdate({_id:req.body.id},req.body, {new:true},(err,doc) =>{
        if(!err){
            res.redirect('/list-user');
        }else{
            console.log(err);
            res.render('users/add.hbs', {
                viewTitle: "CẬP NHẬT"
            });
        }
    });
}
app.get('/update-user/:id', (req, res) =>{ 
    usModel.findById(req.params.id , (err, us) => {
        if(!err){
            res.render('users/add.hbs',{
                viewTitle: "CẬP NHẬT",
                us:us.toJSON()
            });
        }
    })
 });


 app.delete('/json/delete-user', async(req, res) =>{ 
    console.log("-->delete: ",req.query.id)
    try {
        const us = await usModel.findByIdAndDelete(req.query.id, req.body);
        if(us){
            res.json(true)
        } else{
            res.json(false)
        }
     } catch (error) {
         res.json(error.toJSON)
     }
 });



app.get('/del-user/:id', async(req, res) =>{ 
    try {
        const us = await usModel.findByIdAndDelete(req.params.id, req.body);
        if(!us){
            res.status(404).send("No item found");
        } 
        else{
            res.redirect('/list-user');
        }
     } catch (error) {
        res.status(500).send(error);
     }
 });
module.exports = app;