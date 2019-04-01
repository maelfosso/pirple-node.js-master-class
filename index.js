// Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

// The server should respond to all requests with a string
var server = http.createServer(function(req, res) {
  // Get the URL and parse it
  var parseUrl = url.parse(req.url, true);

  // Get the path
  var path = parseUrl.path;
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
  req.on('end', function(data) {
    buffer += decoder.end();

    // Send the reponse
    res.end('Hello World !\n');

    // Log the path
    console.log('Request received with these payload: ', buffer);
  });

});

// Start the server, and have it listen to port 3000
server.listen(3000, function() {
  console.log('The server is listening on port 3000 now');
})
