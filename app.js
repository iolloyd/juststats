var express = require('express');
var fs = require('fs');
var r  = require('redis').createClient();

r.on("error", function(err){
	console.log("Redis client error: " + err);
});

var app = module.exports = express.createServer();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(express.compiler({ src: __dirname + '/public', enable: ['sass'] }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({
      dumpExceptions: true, 
      showStack: true 
  })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes 
require('./routes/main.js')(app, r); 
require('./routes/backoffice.js')(app, r); 

app.listen(3003);
