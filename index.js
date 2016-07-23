var express = require('express');
var app = express();
var nunjucks = require('nunjucks');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

function getBlogObject(file) {
	return new Promise(function(res,rej){
		fs.readFileAsync(file)
		.then(function(r){
			 var lines = r.toString('utf-8').split("\n");
			 return res({url: lines[0].replace(/#/g, ''), title: lines[1].replace(/#/g, ''), description: lines[2].replace(/#/g, '')})
		})
		.catch(function(e){
			return rej();
		})
	})
}

nunjucks.configure('views', {
  autoescape: true,
  express   : app
});

app.use(express.static('public'));

app.get('/', function (req, res) {
  	return res.render('landing.html')
});

app.get('/posts', function (req, res) {
	var posts = [];
	var dir = __dirname+'/posts/';
  	fs.readdirAsync(dir)
  	.then(function(r){
  		return Promise.map(r, function(item){
  			return new Promise(function(res,rej){
  				if(item.split('.')[1] !== 'md'){
  					return res();
  				}
  				getBlogObject(dir+item)
  				.then(function(r){
  					posts.push(r);
  					return res();
  				})
  			})
  		})
  	})
  	.then(function(r){
  		return res.json({posts: posts});
  	})
  	.catch(function(e){
  		return res.json({error: true})
  	})
});

app.get('/i/:image', function (req, res) {
	var validTypes = ['jpg', 'png', 'mp4'];
	if(!req.params.image){
		return res.send("lol");
	}
	var split = req.params.image.split('.');
	if(split.length !== 2 || validTypes.indexOf(split[1]) == -1){
		return res.send("Invalid Image.");
	}
  	return res.sendFile(__dirname+'/private/images/'+image);
});

app.listen(8087, 'localhost', function (){
	console.log("Started.")
});

