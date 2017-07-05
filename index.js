var express = require('express');
var app = express();
var xml = require('xml');
var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);

app.use(bodyParser.xml({trim: true}));

app.get('/', function(req, res) {
  res.send('Hello XML!');
});

app.get('/products', function(req, res) {
  res.set('Content-Type', 'application/xml');
  var products = [];
  for (var i = 0; i < 5; ++i) {
    products.push({ 
      product: [
        { 
          _attr: { 
            productId: `pro${i}` 
          }
        },
        { 
          productName: `Product ${i}`
        },
        {
          productDescription: `Product Description ${i}`
        },
        {
          productCategoryId: 'cat'
        },
        {
          productPrice: i * 1000
        }
      ]
    });
  }

  var categories = [];
  for (var i = 0; i < 5; ++i) {
    categories.push({
      category: [
        { 
          _attr: { 
            categoryId: `cat${i}` 
          }
        },
        {
          categoryName: `Category ${i}`,
          categoryDescription: `Category Description ${i}`
        }
      ]
    });
  }

  var response = {
    productsAndCategories: [
      { products: products },
      { categories: categories }
    ]
  };
  res.send(xml(response));
});

app.get('/customers', function(req, res) {
  res.set('Content-Type', 'application/xml');
  var customers = [];
  for (var i = 0; i < 10; ++i) {
    customers.push({ 
      customer: [
        { 
          _attr: { 
            customerId: `cus${i}` 
          }
        },
        { 
          customerName: `Customer ${i}`
        },
        {
          customerEmail: `customer${i}@mail.com`
        },
        {
          customerPhone: '123456789'
        }
      ]
    });
  }

  var response = {
    customers: customers
  };
  res.send(xml(response));
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
