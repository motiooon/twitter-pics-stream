
/**
 * Module dependencies.
 */

var  express 			= require('express')
  ,  routes 			= require('./routes')
  ,  swig 				= require('swig')
  ,  util 				= require('util')
  ,  twitter 			= require('twitter');

var app = module.exports = express.createServer();

var twit = new twitter({
    consumer_key: 'TXM5w4oukLDhK0mqnAc0A',
    consumer_secret: 'XD8sf8RnDk8w0LYgKxBEXTXOcWAfrGpYNjUBznWDwY',
    access_token_key: '94865161-NsUasRa7HynYkkaEp9bwzie33l9eQS6cLdRi2dvmA',
    access_token_secret: 'b3Ne8EjPnBGZwN7vn6g4ABmStxJTOzn85o0AsN7FLaE'
});


// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
	app.register('.html', swig);
	app.set('view engine', 'html');
	app.set('view options', { layout: false });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

swig.init({
    root: __dirname + '/views',
    allowErrors: true // allows errors to be thrown and caught by express
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);


var io = require('socket.io').listen(8033);

io.sockets.on('connection', function (socket) {
  socket.on('search', function (search_term) {
  	twit.stream('statuses/sample', function(stream) {
    stream.on('data', function(data) {
    	if(data.entities && data.entities.media){
    		
    		// console.log(util.inspect(data.entities.media[0].media_url));
    		
    		//if(data.text.indexOf(search_term) > 0){
    			    		
	      socket.emit('search_data', data.entities.media[0].media_url);
    		//}

    	}
        
    });
});


  });
});



app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
