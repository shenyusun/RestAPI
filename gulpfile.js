/* Setup gulp so I do not have to manual restart Node server everytime I changed something.
   First install gulp with command: npm install -g
   create reference for gulp
   Install gulp-nodemon with command: npm install gulp-nodemon --save
   create reference for nodemon
*/
var gulp = require('gulp'),
	nodemon = require('gulp-nodemon'),
	gulpMocha = require('gulp-mocha'),
	env = require('gulp-env'),
	supertest = require('supertest');

/* Tell gulp that I have a task, and use it pass in a function that'll setup nodemon
   nodemon is going to take a JSON object to configure itself.
*/
gulp.task('default', function(){
	nodemon({
		script: 'app.js',    // What's going to run: apps.js
		ext: 'js',			// What to watch for? I want it to watch for js extension.
		env: {
			PORT: 8000
		},
		ignore: ['./node_modules/**']	 // I don't want to get confuse when there's new modules
	})
	.on('restart', function(){			// Whenever it restart, I am going to call a function
		console.log('Restarting');      // to tell me that it restarted.
	});
});

gulp.task('test', function(){
	env({vars: {ENV: 'Test'}});
	gulp.src('tests/*.js', {read: false})
		.pipe(gulpMocha({reporter: 'nyan'}))
});