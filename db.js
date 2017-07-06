var mysql      = require('mysql');
var connection = mysql.createConnection({
  // host     : 'localhost',
  // user     : 'root',
  // password : 'x',
  // database : 'cellphones'
  host     : 'sql12.freemysqlhosting.net',
  user     : 'sql12183771',
  password : 'HEUNR3euzR',
  database : 'sql12183771'
});

connection.connect();

var api = {};

api.test = function() {
  return new Promise(function(resolve, reject) {
    connection.query('SELECT 1 + 1 AS solution', function(error, results, fields) {
      if (error) reject(error);
      resolve(results[0].solution);
      console.log('The solution is: ', results[0].solution);
    });
  });
};

api.getProducts = function() {
  return new Promise(function(resolve, reject) {
    connection.query('SELECT * FROM `product`', function(error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
};

api.getCategories = function() {
  return new Promise(function(resolve, reject) {
    connection.query('SELECT * FROM `category`', function(error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
};

api.getCustomers = function() {
  return new Promise(function(resolve, reject) {
    connection.query('SELECT * FROM `customer`', function(error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
};

api.getOrders = function() {
  return new Promise(function(resolve, reject) {
    connection.query('SELECT * FROM `orders`', function(error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
};

api.getOrderDetails = function() {
  return new Promise(function(resolve, reject) {
    connection.query('SELECT * FROM `order_detail`', function(error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
};

api.getOneAgency = function() {
  return new Promise(function(resolve, reject) {
    connection.query('SELECT * FROM `agency` LIMIT 1', function(error, results, fields) {
      if (error) reject(error);
      resolve(results[0]);
    });
  });
};

api.addCustomers = function(customers) {
  return new Promise(function(resolve, reject) {
    var sql = 'INSERT INTO `customer` (`id`, `fullname`, `phone`, `address`, `email`) VALUES ?';
    var rows = customers.map(function(customer) {
      return [customer.id, customer.fullname, customer.phone, customer.address, customer.email];
    });
    connection.query(sql, [rows], function(error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
};

api.addOrders = function(orders) {
  return new Promise(function(resolve, reject) {
    var sql = 'INSERT INTO `orders` (`id`, `date`, `customer_id`, `agency_id`) VALUES ?';
    var rows = orders.map(function(order) {
      return [order.id, order.date, order.customer_id, order.agency_id];
    });
    connection.query(sql, [rows], function(error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
};

api.addOrderDetails = function(orderDetails) {
  return new Promise(function(resolve, reject) {
    var sql = 'INSERT INTO `order_detail` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES ?';
    var rows = orderDetails.map(function(orderDetail) {
      return [orderDetail.id, orderDetail.order_id, orderDetail.product_id, orderDetail.quantity, orderDetail.price];
    });
    connection.query(sql, [rows], function(error, results, fields) {
      if (error) reject(error);
      resolve(results);
    });
  });
};

api.endConnection = function() {
  connection.end();  
};

module.exports = api;