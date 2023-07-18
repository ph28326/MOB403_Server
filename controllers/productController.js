const express = require('express');
const proModel = require('../model/product');
var multer = require('multer');
var bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/png') {
            cb(null, 'uploads/images/products');
        } else {
            cb(new Error('not image'), null);
        }

    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.jpg');
    }
})

var upload = multer({ storage: storage });

app.get('/add-product', (req, res) => {
    res.render('products/add.hbs', {
        viewTitle: 'THÊM SẢN PHẨM MỚI'
    });
});


app.get('/json/list-product', (req, res) => {
    proModel.find({}).then(products => {
        res.json(products);
    })
});

app.get('/json/detail-product', (req, res) => {
    console.log("-->get detail: ", req.query.id)
    proModel.findById(req.query.id, (err, pro) => {
        if (!err) {
            res.json(pro);
        }
    })
});
app.get('/list-product', (req, res) => {
    console.log("-->get list product")
    proModel.find({}).then(products => {
        res.render('products/list.hbs', {
            viewTitle: 'TRANG CHỦ',
            products: products.map(product => product.toJSON())
        });
    })

});




app.post('/add-product', upload.single('image'), async (req, res) => {
    if (req.body.id == '') {
        AddRecord(req, res);
    } else {
        updateRecord(req, res);
    }
});



function AddRecord(req, res) {
    var img = "null";
    try {
        img = req.file.filename;
    } catch (error) {

    }
    const pro = new proModel({
        name: req.body.name,
        brand: req.body.brand,
        category: req.body.category,
        description: req.body.description,
        price0: req.body.price0,
        price1: req.body.price1,
        image: img,
    });
    try {
        pro.save();
        res.redirect('/list-product');
    } catch (error) {
        res.status(500).send(error);
    }
}

function updateRecord(req, res) {
    proModel.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.redirect('/list-product');
        } else {
            console.log(err);
            res.render('products/add.hbs', {
                viewTitle: "CẬP NHẬT"
            });
        }
    });
}

app.get('/update-product/:id', (req, res) => {
    proModel.findById(req.params.id, (err, pro) => {
        if (!err) {
            res.render('products/add.hbs', {
                viewTitle: "CẬP NHẬT",
                pro: pro.toJSON()
            });
        }
    })
});



app.delete('/json/delete-product', async (req, res) => {
    console.log("-->delete: ", req.query.id)
    try {
        const pro = await proModel.findByIdAndDelete(req.query.id, req.body);
        if (pro) {
            res.json(true)
        } else {
            res.json(false)
        }
    } catch (error) {
        res.json(error.toJSON)
    }
});



app.get('/del-product/:id', async (req, res) => {
    try {
        const pro = await proModel.findByIdAndDelete(req.params.id, req.body);
        if (!pro) {
            res.status(404).send("No item found");
        }
        else {
            res.redirect('/list-product');
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/search', async (req, res) => {
    let result = await proModel.find({
        "$or": [
            {
                name: { $regex: req.query.key }
            },
            {
                brand: { $regex: req.query.key }
            },
            {
                category: { $regex: req.query.key }
            }
        ]
    }).then(products => {
        res.render('products/list.hbs', {
            viewTitle: 'TRANG CHỦ',
            products: products.map(result => result.toJSON())
        });
    });
})

module.exports = app;