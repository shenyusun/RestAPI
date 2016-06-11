var bookController = function(Book){

	var post = function(req, res){
		var book = new Book(req.body);

		if(!req.body.title){
			res.status(400);
			res.send('Title is require');
		}
		else{
			// I am going to send status '201' which means created, and then send actual book ID back
			book.save();
			res.status(201);
			res.send(book);  // ==== End: Post a new item back to my API ====
		}

		
	}

	var get = function(req,res){
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
			else{
				
				var returnBooks = [];
				books.forEach(function(element, index, array){
					var newBook = element.toJSON();
					newBook.links = {};
					newBook.links.self = 'http://' + req.headers.host + '/api/books/' + newBook._id
					returnBooks.push(newBook);
				});
				res.json(returnBooks);
			}
		});
	}
	return {
		post: post,
		get: get
	}
	
}

module.exports = bookController;