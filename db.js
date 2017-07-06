var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'x',
  database : 'cellphones'
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

api.endConnection = function() {
  connection.end();  
};

module.exports = api;