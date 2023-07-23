const express = require('express');
const mongoose = require('mongoose');

const Phone = require('./model/phone');
const uri = "mongodb+srv://toantqkph28326:toantqkph28326@cluster0.pdvbfsv.mongodb.net/api?retryWrites=true&w=majority";
const bodyParser = require('body-parser');

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() =>{
    console.log("Da ket noi voi MongoDB");
}).catch((err) => {
    console.log("Khong the ket noi voi MongoDB", err)
})

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/listPhone', async function (req, res){
    try {
        const list = await Phone.find().lean();
        console.log('da hien thi danh sach');
        res.json(list);   
    }catch(err){
        console.log('Error fetching products:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// Định nghĩa API thêm sản phẩm
app.post('/addPhones', async (req, res) => {
    try {
        const { name, brand, price, quantity } = req.body;
        const phone = new Phone({ name, brand, price, quantity });
        await phone.save();
        //res.json(car);
        const list = await Phone.find().lean();
        res.json(list);
    } catch (err) {
        console.error('Error adding product:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Định nghĩa API sửa đổi sản phẩm
app.put('/phones/:phoneId', async (req, res) => {
    try {
      const { phoneId } = req.params;
      const { name, brand, price, quantity } = req.body;
      const phone = await Phone.findByIdAndUpdate(
        phoneId,
        { name, brand, price, quantity },
        { new: true }
      );
      res.json(phone);
    } catch (err) {
      console.error('Error updating product:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Định nghĩa API xóa sản phẩm
  app.delete('/phones/:phoneId', async (req, res) => {
    try {
      const { phoneId } = req.params;
      await Phone.findByIdAndRemove(phoneId);
      res.json({ success: true });
    } catch (err) {
      console.error('Error deleting product:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Khởi động server
  const port = 8000;
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });