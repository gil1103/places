const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const userRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mern.c9pdq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());

// if static file (as js file) is required, use the below 2 routes
app.use('/uploads/images', express.static(path.join('uploads', 'images'))); // return files on this folder
app.use(express.static(path.join('public'))); // if the above route was not found use this one

// app.use((req, res, next) => { // require only if client and server using different hosts
// 	res.setHeader('Access-Control-Allow-Origin', '*');
// 	// show which domains can access to the browser (otherwise will be blocked by cors)
// 	// '*' means that any domain can send a request to the browser, otherwise
// 	// we should define for example http://localhost:3001 etc
// 	res.setHeader(
// 		'Access-Control-Allow-Headers',
// 		'Origin, x-Requested-with, Content-Type, Accept, Authorization'
// 	);
// 	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
// 	next();
// });

app.use('/api/places', placesRoutes); // /api/places==>main route, placesRoutes==>relative to the main route
app.use('/api/users', userRoutes);

// in case the static routes(in the front) are required use the above, otherwise use this one
app.use((req, res, next) => {
	res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// app.use((req, res, next) => {
// 	const error = new HttpError('Could not find this route', 404);
// 	throw error;
// });

app.use((error, req, res, next) => {
	if (req.file) {
		fs.unlink(req.file.path, (err) => {
			console.log(err);
		});
	}
	if (res.headerSent) {
		return next(error);
	}
	res.status(error.code || 500);
	res.json({ message: error.message || 'An unknown error occured!' });
});

const port = process.env.PORT || 5000;

mongoose
	.connect(url)
	.then(() => {
		app.listen(port);
	})
	.catch((err) => console.log(err));
