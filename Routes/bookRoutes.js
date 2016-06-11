var express = require('express');

var routes = function(Book){
	// Better way to create bunch of routes is to use --- a router.
	// Create a router called bookRouter, I can use it to define all my routes
	var bookRouter = express.Router();  
	var bookController = require('../Controllers/bookController')(Book)

	// This is my Books route, and it is going to send back json.
	// I need somehting called body-parser -> A middle ware that allows 'express' to read the body,
	// and pass it to JSON so express could understand it. "npm install body-parser --save"

	bookRouter.route('/')
	// ==== Start: Post a new item back to my API ====
		.post(bookController.post)  // ==== Start: Get a list of items ====
		.get(bookController.get);
	// ==== End: Get a list of items ====

	/* Create a middleware
	 with params 'next', tell function to pass on to the next thing that's to be done.
	 In this case, I only have one piece of Middleware, it's going to move onto this .get or this .put
	 If I have more middleware, it is going to move onto the next piece of Middleware.
	*/ 
	bookRouter.use('/:bookId', function(req, res, next){
		Book.findById(req.params.bookId, function(err, book){
			if(err)
				res.status(500).send(err);
			else if(book)
			{
				req.book = book;
				next();
			}
			else
			{
				res.status(404).send('no book found');
			}	
			
		});
	});

	// Get the single item with ID
	bookRouter.route('/:bookId')					  // In order to update item out of 
		.get(function(req,res){	
			var returnBook = req.book.toJSON();
			returnBook.links = {};
			var newLink = 'http://' + req.headers.host + '/api/books/?genre=' + returnBook.genre;
			returnBook.links.FilterByThisGenre = newLink.replace(' ', '%20');
			res.json(returnBook);					    // MongoDB database, I need to get the item
		})										   // that I'm editing, so I use book.findById
		.put(function(req,res){				      // and then req.params.bookId. If I have issue
			req.book.title = req.body.title;     // then I'll send back an error.
			req.book.author = req.body.author;	// If I do have a book, then replace the
			req.book.genre = req.body.genre;   // contents of the book with what has come back
			req.book.read = req.body.read;	  // Use book.save() to save my changes.
			req.book.save(function(err){
				if (err)
					res.status(500).send(err);
				else
					res.json(req.book);
			});				 			 
		})
		.patch(function(req, res){
			if(req.body._id)
				delete req.body._id;
			// for in loop means is that for every key in req.body it's going to give me 
			// that key name, which is useful for navigating stuff.
			for (var p in req.body) 
			{
				req.book[p] = req.body[p];
			}

			req.book.save(function(err){
				if (err)
					res.status(500).send(err);
				else
					res.json(req.book);
			});
		})
		.delete(function(req, res){
			req.book.remove(function(err){
				if(err)
					res.status(500).send(err)
				else
					res.status(204).send('Removed');
			});
		});									 
	return bookRouter;					    
};										  
						   				 
						  
// making it as funciton if I want to test or inject anything, I can just pass things
// in into this function and then do my module.exports.
module.exports = routes;