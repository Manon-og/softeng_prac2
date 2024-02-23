const express = require('express');
const app = express();

const mysql = require('mysql2');

const bodyParser = require('body-parser');
const path = require('path');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'wakoyuyab',
  database: 'SoftEng'
});

app.get("/", (req, res) => {
  connection.connect((err) => {
    connection.query('SELECT * FROM Product', (err, results) => {
      
      let queryResults = results.map(result => ({
        Product: result.ProductName,
        Price: result.Price,
        StockQuantity: result.StockQuantity,
        ProductID: result.ProductID
      }));

      console.log(queryResults);

      res.render('index', { queryResults });
    });
  });
});

app.post("/addProduct", (req, res) => {
  const { productName, price, stockQuantity } = req.body;

  connection.query(
    'INSERT INTO Product (ProductName, Price, StockQuantity) VALUES (?, ?, ?)',
    [productName, price, stockQuantity],
    (err, results) => {
      console.log('Product added successfully');
      res.redirect('/');
    }
  );
});

app.post("/deleteProduct", (req, res) => {
  const productId = req.body.productId;

  connection.query(
    'DELETE FROM Product WHERE ProductID = ?',
    [productId],
    (err, results) => {
      console.log('Product deleted successfully');
      res.redirect('/');
    }
  );
});

app.get('/transactions', (req, res) => {
    connection.query('SELECT * FROM SHOP', (err, results) => {

      let transactions = results.map(result => ({
        transactionID: result.id,
        name: result.name,
        facebook: result.facebook,
        number: result.number,
        flavor: result.flavor,
        design: result.design,
        size: result.size,
        dedication: result.dedication,
        addons: result.addons,
        instruction: result.instruction,
        bread: result.bread,
        cupcakes: result.cupcakes,
        pastries: result.pastries,
        payment: result.payment,
        delivery: result.delivery,
        pickup_date: result.pickup_date,
        pickup_time: result.pickup_time,
        delivery_location: result.delivery_location,
    }));
      res.render('index3', { transactions }); 
    });
  });
  
app.get('/order', (req, res) => {
    res.render('index2'); 
  });
  app.post('/submitOrder', (req, res) => {
    const {
      name,
      facebook,
      number,
      flavor,
      design,
      size,
      dedication,
      addons,
      instruction,
      bread,
      cupcakes,
      pastries,
      payment,
      delivery,
      pickupDate,
      pickupTime,
      deliveryLocation,
    } = req.body;
  
    const query = `
    INSERT INTO SHOP (name, facebook, number, flavor, design, size, dedication, addons, instruction, bread, cupcakes, pastries, payment, delivery, pickup_date, pickup_time, delivery_location)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(
      query,
      [
        name,
        facebook,
        number,
        flavor,
        design,
        size,
        dedication,
        addons,
        instruction,
        bread,
        cupcakes,
        pastries,
        payment,
        delivery,
        pickupDate,
        pickupTime,
        deliveryLocation,
      ],
      (err, results) => {
        console.log('submitted successfully');
        res.redirect('/');
      }
    );
  });
  
  const port = 3000;
  app.listen(port, () => {
    console.log(`server at http://localhost:${port}`);
  });