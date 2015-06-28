console.log("Starting Server");

var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

var mimeTypes = {
  "html": "text/html",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "png": "image/png",
  "js": "text/javascript",
  "css": "text/css",
};

// var angular = require('angular');
var server = http.createServer(function(req, res) {
  var uri = url.parse( req.url ).pathname; 
  if (uri === '/') { uri = '/view/index.html'; }
  var filename = path.join(process.cwd(), uri);
  console.log(filename);
  fs.exists( filename, function(exists) {
    if (!exists) {
      res.writeHead(200);
      res.end("Nothing coming here");
      return;
    }
    var mimeType = mimeTypes[path.extname(filename).split('.')[1]];
    console.log(mimeType);
    res.writeHead(200, mimeType);
    var fileStream = fs.createReadStream(filename);
    fileStream.pipe(res);
    // res.end(fs.readFileSync("view/index.html", "utf-8"));
  });
});
server.listen(8080);
