var express = require('express');
var app = express();
var Promise = require('bluebird');
var compression = require('compression');

app.use(express.static('public',{ maxAge: 31557600000 }));
app.use(compression());

nunjucks.configure('views', {
  autoescape: true,
  express   : app
});
app.get('/:image', function (req, res) {
	var validTypes = ['jpg', 'png', 'mp4'];
	if(!req.params.image){
		return res.send("Missing Image.");
	}
	var split = req.params.image.split('.');
	if(split.length !== 2 || validTypes.indexOf(split[1]) == -1){
		return res.send("Invalid Image.");
	}
  	return res.sendFile(__dirname+'/images/'+req.params.image);
});

app.listen(8087, 'localhost', function (){
	console.log("Started.")
});

