// Dependencies
var http = require('http');
var url = require('url');

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

  // Send the reponse
  res.end('Hello World !\n');

  // Log the path
  console.log('Request received on path: ', trimmedPath, ' with method: ', method, ' and with these query string parameters ', queryStringObject);
});

// Start the server, and have it listen to port 3000
server.listen(3000, function() {
  console.log('The server is listening on port 3000 now');
})
