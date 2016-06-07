// Create reference to express
// mongoose is to convert mongo db to json format.
var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser');

// Open mongodb connection
var db = mongoose.connect('mongodb://localhost/bookAPI');

// Mongoose knows how to translate the data that it gets out of MongoDB is uses a modles.
// Create a model called bookModel
var Book = require('./models/bookModel');

// Create instance on express so we can use it
var app = express();

// Setup a port
var port = process.env.PORT || 3000; // If PORT is not there, then give PORT 3000


/* I need to let my app know that I need to use the bodyparser
	bodyParser.json -> to tell what type of body I am going to use.
	bodyParser is going to check if it has any JSON objects in it, and if it does
	then it's going to take that JSON object and add it to req.body, and I can use 
	req.body to create new book
*/	
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// Better way to create bunch of routes is to use --- a router.
// Create a router called bookRouter, I can use it to define all my routes
var bookRouter = express.Router();  

// This is my Books route, and it is going to send back json.
// I need somehting called body-parser -> A middle ware that allows 'express' to read the body,
// and pass it to JSON so express could understand it. "npm install body-parser --save"

bookRouter.route('/Books')
	.post(function(req, res){
		var book = new Book(req.body);

		// I am going to send status '201' which means created, and then send actual book ID back
		book.save();
		res.status(201).send(book);
	})
	.get(function(req,res){
		var query = {};    // Create a empty query

		// If query is not empty, then get genre. This make sure that we don't take
		// This is a cleaner way to make sure that I am not just taking random user input
		// and sending that on through.
		if (req.query.genre)
		{
			query.genre = req.query.genre;
		}
		else if (req.query.title)
		{
			query.title = req.query.title;
		}

		Book.find(query, function(err, books){
			if(err)
				res.status(500).send(err);
			else
				res.json(books);
		});
	});

// Get the single item with ID
bookRouter.route('/Books/:bookId')
	.get(function(req,res){
		Book.findById(req.params.bookId, function(err, book){
			if(err)
				res.status(500).send(err);
			else
				res.json(book);
		});
	});

app.use('/api', bookRouter);	// This take care of loading all of the roots up into app.use

/*
	Setup handle for root
	First param '/' is the root of your site. Second param is going to be a callback function.
	Anytime anything hits that root slash, this function will be executed and Express is going 
	to pass two variables, req and res. Req is the request that was sent by the client,
	res is the response that we are going. Here I am sending back a message.

*/
app.get('/', function(req,res){
	res.send ('Welcome to my API! Practice makes perfect yea?');
});

// Now I need to make express start listening on the port. Use app.listen with the port number.
app.listen(port, function(){
	console.log('Gulp is running this app on PORT: ' + port);
});

