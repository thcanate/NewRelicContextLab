var newrelic = require('newrelic');
const userLogger = require('../logger.js');
var express = require('express');
var fs = require('fs');
var open = require('open');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var RestaurantRecord = require('./model').Restaurant;
var MemoryStorage = require('./storage').Memory;

var API_URL = '/api/restaurant';
var API_URL_ID = API_URL + '/:id';
var API_URL_ORDER = '/api/order';

var removeMenuItems = function(restaurant) {
  var clone = {};

  Object.getOwnPropertyNames(restaurant).forEach(function(key) {
    if (key !== 'menuItems') {
      clone[key] = restaurant[key];
    }
  });

  return clone;
};


exports.start = function(PORT, STATIC_DIR, DATA_FILE, TEST_DIR) {
  var app = express();
  var storage = new MemoryStorage();

  // log requests
  app.use(morgan('combined'))

  // serve static files for demo client
  app.use(express.static(STATIC_DIR));

  // parse body into req.body
  app.use(bodyParser.json());

  // API
  app.get(API_URL, function(req, res, next){
    //Loggin NR
    userLogger.info('pagina Home selecionada');
    res.status(200).send(storage.getAll().map(removeMenuItems))
  });


  app.post(API_URL, function(req, res, next) {
    var restaurant = new RestaurantRecord(req.body);
    var errors = [];

    if (restaurant.validate(errors)) {
      storage.add(restaurant);
      return res.status(201).send(restaurant);
    }
    userLogger.error('Error POST')
    return res.status(400).send({error: errors});
  });

  app.post(API_URL_ORDER, function(req, res, next) {
    console.log(req.body)
    var order = req.body;
    var itemCount = 0;
    var orderTotal = 0;
    order.items.forEach(function(item) {
      itemCount += item.qty;
      orderTotal += item.price * item.qty;
    });
        userLogger.info('Restaurant: '+ order.restaurant.name + ' Order completed total: ' + orderTotal);
    newrelic.addCustomAttributes({
      'customer': order.deliverTo.name,
      'restaurant': order.restaurant.name,
      'itemCount': itemCount,
      'orderTotal': orderTotal
    });
    return res.status(201).send({ orderId: Date.now()});
  });


  app.get(API_URL_ID, function(req, res, next) {
    var restaurant = storage.getById(req.params.id);

    if (restaurant) {
    //Loggin NR
    userLogger.info('restaurante selecionado: ' + req.params.id);
      return res.status(200).send(restaurant);
    }
     userLogger.error('O restaurante: ' + req.params.id + ' nao existe');
    return res.status(400).send({error: 'No restaurant with id "' + req.params.id + '"!'});
  });


  app.put(API_URL_ID, function(req, res, next) {
    var restaurant = storage.getById(req.params.id);
    var errors = [];

    if (restaurant) {
      restaurant.update(req.body);
      return res.status(200).send(restaurant);
    }

    restaurant = new RestaurantRecord(req.body);
    if (restaurant.validate(errors)) {
      storage.add(restaurant);
      return res.status(201).send(restaurant);
    }
    userLogger.error('error')
    return res.status(400).send({error: errors});
  });


  app.delete(API_URL_ID, function(req, res, next) {
    if (storage.deleteById(req.params.id)) {
      return res.status(204).send(null);
    }

    return res.status(400).send({error: 'No restaurant with id "' + req.params.id + '"!'});
  });


  // only for running e2e tests
  app.use('/test/', express.static(TEST_DIR));


  // start the server
  // read the data from json and start the server
  fs.readFile(DATA_FILE, function(err, data) {
    JSON.parse(data).forEach(function(restaurant) {
      storage.add(new RestaurantRecord(restaurant));
    });

    app.listen(PORT, function() {
      open('http://localhost:' + PORT + '/');
      console.log('Go to http://localhost:' + PORT + '/');
    });
  });


  // Windows and Node.js before 0.8.9 would crash
  // https://github.com/joyent/node/issues/1553
  try {
    process.on('SIGINT', function() {
      // save the storage back to the json file
      fs.writeFile(DATA_FILE, JSON.stringify(storage.getAll()), function() {
        process.exit(0);
      });
    });
  } catch (e) {}

};
