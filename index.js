var express = require('express');
var app = express();
var Promise = require('bluebird');
var compression = require('compression');
var fs = Promise.promisifyAll(require('fs'));
var videos = require('./404');

app.use(express.static('public',{ maxAge: 31557600000 }));
app.use(compression());

app.get(['/:image','*'], function(req,res){
	var video = videos[Math.floor(Math.random()*videos.length)];
	var notFound = '<style>html,body{padding:0;margin:0;display:flex;align-items:center;justify-content:center;flex-direction:column;font-family: "Helvetica";z-index:-1} iframe{position:absolute;top:0;left:0;border:0;width:100vw;height:100vh} h1,h3,h6{color:white;text-shadow:0px 0px 5px rgba(0,0,0,.5);z-index:9999;margin:0;} h1{font-size:1500%;font-weight:900;} h3{font-size:500%;font-weight:500;};</style><iframe src="https://youtube.com/embed/'+video+'?autoplay=1&controls=0&fs=0&loop=1&playlist='+video+'&modestbranding=1&showinfo=0&rel=0"></iframe><h1>404</h1><h3>This image was not found.</h3><h6>(so enjoy a meme instead)</h6>';
	
	if(!req.params.image){
		return res.send(notFound);
	}
	
	var split = req.params.image.split('.');
	if(!req.params.image || split.length !== 2){
		return res.send(notFound);
	}
	var url = __dirname+'/images/'+req.params.image;
	fs.stat(url, function(err, stat) {
	    if(err){
	    	return res.send(notFound);
	    }
	    return res.sendFile(url);
	});
});

app.listen(8087, 'localhost', function (){
	console.log("Started.")
});

