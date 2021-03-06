var express = require('express');
var app = express();
var xml = require('xml');
var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
var db = require('./db');
var utils = require('./utils');

app.use(bodyParser.xml({trim: true}));

app.get('/', function(req, res) {
  res.send('Hello XML!');
});

app.get('/all', function(req, res) {
  var promises = [db.getProducts(), db.getCategories(), db.getCustomers(), db.getOrders(), db.getOrderDetails(), db.getOneAgency()];
  Promise.all(promises).then(function(data) {
    var response = {
      data: [
        { products: utils.productsInXML(data[0]) },
        { categories: utils.categoriesInXML(data[1]) },
        { customers: utils.customersInXML(data[2]) },
        { orders: utils.ordersInXML(data[3], data[4]) }
      ]
    };
    res.set('Content-Type', 'application/xml');
    res.send(xml({ 
      company: [{ 
        agency: utils.agencyInXML(data[5], data[0], data[1], data[2], data[3], data[4])
      }]
    }));
  }).catch(function(err) {
    console.error(err);
  });
});

app.get('/products', function(req, res) {
  var promises = [db.getProducts(), db.getCategories()];
  Promise.all(promises).then(function(data) {
    var response = {
      productsAndCategories: [
        { products: utils.productsInXML(data[0]) },
        { categories: utils.categoriesInXML(data[1]) }
      ]
    };
    res.set('Content-Type', 'application/xml');
    res.send(xml(response));
  });
});

app.get('/customers', function(req, res) {
  db.getCustomers().then(function(data) {
    var response = {
      customers: utils.customersInXML(data)
    };
    res.set('Content-Type', 'application/xml');
    res.send(xml(response));
  });
});

app.post('/sync', function(req, res) {
  var currentAgency = req.body.company.agency[0];
  var agency = {
    id: currentAgency.$.agencyId,
    name: currentAgency.agencyName[0],
    address: currentAgency.agencyAddress[0],
    phone: currentAgency.agencyPhone[0]
  };
  
  var customers = null;
  if (req.body.company.agency[0].customers[0]) {
    var currentCustomers = req.body.company.agency[0].customers[0].customer;
    var customers = currentCustomers.map(function(customer) {
      return {
        id: customer.$.customerId,
        fullname: customer.customerName[0],
        email: customer.customerEmail[0],
        phone: customer.customerPhone[0],
        address: ''
      }
    });
  }

  var orders = null;
  var orderDetails = null;
  if (req.body.company.agency[0].orders[0]) {
    var currentOrders = req.body.company.agency[0].orders[0].order;
    var orders = [];
    var orderDetails = [];
    currentOrders.forEach(function(order) {
      orders.push({
        id: order.$.orderId,
        customer_id: order.customerId[0],
        date: order.orderDate[0],
        agency_id: agency.id
      });

      var currentOrderDetails = order.orderDetails[0].orderDetail;
      orderDetails = orderDetails.concat(currentOrderDetails.map(function(orderDetail) {
        return {
          id: orderDetail.$.orderDetailId,
          order_id: order.$.orderId,
          product_id: orderDetail.productId[0],
          quantity: orderDetail.numberProducts[0],
          price: orderDetail.price[0]
        };
      }));
    });
  }
  console.log(JSON.stringify(customers));
  console.log(JSON.stringify(orders));
  console.log(JSON.stringify(orderDetails));
  db.addCustomers(customers).then(function() {
    return db.addOrders(orders);
  }).then(function() {
    return db.addOrderDetails(orderDetails);
  }).then(function(data) {
    console.log(data);
    res.send();
  }).catch(function(err) {
    console.error(err);
  });
});

app.use(function (err, req, res, next) {
  if (err.status == 400)
    return res.status(400).send('Invalid XML.');
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

var port = process.env.PORT || 3000;
// console.log(process.env.PORT);
app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
});
