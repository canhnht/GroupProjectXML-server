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
  console.log(req.body);
  var currentAgency = req.body.company.agency[0];
  var agency = {
    agencyId: currentAgency.$.agencyId,
    agencyName: currentAgency.agencyName[0],
    agencyAddress: currentAgency.agencyAddress[0],
    agencyPhone: currentAgency.agencyPhone[0]
  };

  var currentCustomers = req.body.company.agency[0].customers[0].customer;
  var customers = currentCustomers.map(function(customer) {
    return {
      customerId: customer.$.customerId,
      customerName: customer.customerName[0],
      customerEmail: customer.customerEmail[0],
      customerPhone: customer.customerPhone[0]
    }
  });

  var currentOrders = req.body.company.agency[0].orders[0].order;
  var orders = [];
  var orderDetails = [];
  currentOrders.forEach(function(order) {
    orders.push({
      orderId: order.$.orderId,
      customerId: order.customerId[0],
      orderDate: order.orderDate[0],
      totalPrices: order.totalPrices[0]
    });

    var currentOrderDetails = order.orderDetails[0].orderDetail;
    orderDetails = orderDetails.concat(currentOrderDetails.map(function(orderDetail) {
      return {
        orderDetailId: orderDetail.$.orderDetailId,
        productId: orderDetail.productId[0],
        numberProducts: orderDetail.numberProducts[0],
        price: orderDetail.price[0]
      };
    }));
  });

  res.json({ agency, customers, orders, orderDetails });
});

app.use(function (err, req, res, next) {
  if (err.status == 400)
    return res.status(400).send('Invalid XML.');
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
