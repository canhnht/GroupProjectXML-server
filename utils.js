
var api = {};

api.productsInXML = function(products) {
  return products.map(function(product) {
    return { 
      product: [
        { 
          _attr: { 
            productId: product.id
          }
        },
        { 
          productName: product.name
        },
        {
          productPrice: product.unit_price
        },
        {
          productQuantity: product.quantity
        },
        {
          productCategoryId: product.category_id
        }
      ]
    };
  });
};

api.categoriesInXML = function(categories) {
  return categories.map(function(category) {
    return {
      category: [
        { 
          _attr: { 
            categoryId: category.id
          }
        },
        {
          categoryName: category.name
        },
        {
          categoryDescription: category.description
        }
      ]
    };
  });
};

api.customersInXML = function(customers) {
  return customers.map(function(customer) {
    return { 
      customer: [
        { 
          _attr: { 
            customerId: customer.id
          }
        },
        { 
          customerName: customer.fullname
        },
        {
          customerEmail: customer.email
        },
        {
          customerPhone: customer.phone
        },
        {
          customerAddress: customer.address
        }
      ]
    };
  });
};

api.ordersInXML = function(orders, orderDetails) {
  var fullOrders = orders.reduce(function(result, order) {
    result[order.id] = order;
    result[order.id].orderDetails = [];
    return result;
  }, {});
  orderDetails.forEach(function(orderDetail) {
    fullOrders[orderDetail.order_id].orderDetails.push(orderDetail);
  });
  return Object.keys(fullOrders).map(function(orderId) {
    var order = fullOrders[orderId];
    return { 
      order: [
        { 
          _attr: { 
            orderId: orderId
          }
        },
        { 
          customerId: order.customer_id
        },
        {
          orderDate: order.date.toDateString()
        },
        {
          orderDetails: api.orderDetailsInXML(order.orderDetails)
        }
      ]
    };
  });
};

api.orderDetailsInXML = function(orderDetails) {
  return orderDetails.map(function(orderDetail) {
    return {
      orderDetail: [
        { 
          _attr: { 
            orderDetailId: orderDetail.id
          }
        },
        { 
          productId: orderDetail.product_id
        },
        {
          numberProducts: orderDetail.quantity
        },
        {
          price: orderDetail.price
        }
      ]
    };
  })
};

api.agencyInXML = function(agency, products, categories, customers, orders, orderDetails) {
  return [
    { 
      _attr: { 
        agencyId: agency.id
      }
    },
    { 
      agencyName: agency.name
    },
    {
      agencyAddress: agency.address
    },
    {
      agencyPhone: agency.phone
    },
    {
      products: api.productsInXML(products)
    },
    {
      categories: api.categoriesInXML(categories)
    },
    {
      customers: api.customersInXML(customers)
    },
    {
      orders: api.ordersInXML(orders, orderDetails)
    }
  ];
}

module.exports = api;
