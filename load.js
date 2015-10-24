console.log("Starting Server");

var express = require('express');
var app = express();
var fs = require('fs');

app.use('/', express.static('./public/view'));
app.use('/view/', express.static('./public/view'));
app.use('/font/', express.static('./public/font'));
app.use('/style/', express.static('./public/style'));
app.use('/audio/', express.static('./public/audio'));
app.use('/img/', express.static('./public/img'));
app.use('/js/', express.static('./public/js'));
app.use('/config/', express.static('./public/config'));

var server = app.listen(8080, function() {
	console.log("Game is listening");
});
server.listen(8080);
