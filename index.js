// Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');

// Instantiate the HTTP server
var httpServer = http.createServer(function(req, res) {
  unifiedServer(req, res);
});

// Start the server
httpServer.listen(config.httpPort, function() {
  console.log('The server is listening on port ', config.httpPort);
})

// Instantiate the HTTPs server
var httpsServerOptions = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem')
};
var httpsServer = https.createServer(httpsServerOptions, function(req, res) {
  unifiedServer(req, res);
});

// Start the HTTPs server
httpsServer.listen(config.httpsPort, function() {
  console.log('The server is listening on port ', config.httpsPort);
})


// All the server logic for both http and https
var unifiedServer = function(req, res) {
  // Get the URL and parse it
  var parseUrl = url.parse(req.url, true);

  // Get the path
  var path = parseUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g,'')

  // Get the query String as an object
  var queryStringObject = parseUrl.query;

  // Get the HTTP Method
  var method = req.method.toLowerCase();

  // Get the headers
  var headers = req.headers;

  // Get the payload
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', function(data) {
    buffer += decoder.write(data);
  });
  req.on('end', function() {
    buffer += decoder.end();

    // Choose the handler this request should go to
    var choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // Construct the data object to send to the handler
    var data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': buffer
    };

    // Route the request to the choosen handler specified in the router
    choosenHandler(data, function(statusCode, payload) {
      // Use the status code call back by the handler or default to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      // Use a default payload callback by the handler or define an empty object
      payload = typeof(payload) == 'object' ? payload : {};

      // Convert the payload to a string
      var payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader("Content-Type", 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the path
      console.log('Returning this response ', statusCode, payloadString);
    })

    // Send the reponse
    res.end('Hello World !\n');


  });

}

// Define  Handlers for router
var handlers = {};

// Sample Handler
handlers.sample = function(data, callback) {
  // Callback a http status code and a payload object

  callback(406, {'name': 'sample handler'});
}

// Not found handler
handlers.notFound = function(data, callback) {
  callback(404);
}

// Define a request router
var router = {
  'sample': handlers.sample
}
