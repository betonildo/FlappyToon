var express = require('express');
var app = express();


app.use(express.static(__dirname + '/public'));


app.listen(8888, function(){
	console.log("Server running @ http://localhost:8888");
});