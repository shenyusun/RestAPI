// Getting reference to mongoose
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// Database schema
var bookModel = new Schema({
	title: {type: String},
	author: {type: String},
	genre: {type: String},
	read: {type: Boolean, default:false}
});

// Load this model into mongoose, and I am going to call it Book with bookModel schema
// This tells Mongoose that I have a new model or a new schema called book.
module.exports = mongoose.model('Book', bookModel);