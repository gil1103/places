const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const fs = require('fs');
const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');

const getPlaceById = async (req, res, next) => {
	const placeId = req.params.pid; // {pid:'p1'}

	let place;
	try {
		place = await Place.findById(placeId);
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not find a place',
			500
		);
		return next(error);
	}

	if (!place) {
		const error = new HttpError(
			'Could not find a place for the provided id',
			404
		);
		return next(error);
	}
	res.json({ place: place.toObject({ getters: true }) });
	// converts the mongoose document into a plain JavaScript object.
	// To have all virtuals show up, set the toObject option to { getters: true }:
};

const getPlacesByUserId = async (req, res, next) => {
	const userId = req.params.uid; // {uid:'u1'}

	// let places;
	// try {
	// 	places = await Place.find({ creator: userId });
	// } catch (err) {
	// 	const error = new HttpError(
	// 		'Fetching places failed, please try again letter',
	// 		500
	// 	);
	// 	return next(error);
	// }

	let userWithPlaces;
	try {
		userWithPlaces = await User.findById(userId).populate('places');
		// because the user schema includes only the ObjectId of the places,
		// by doing populate we are making the connection between places ObjectId
		// and places schema. w/o populate we will get back only the ObjectId and
		// not full place object --> https://www.youtube.com/watch?v=kjKR0q8EBKE
	} catch (err) {
		const error = new HttpError(
			'Fetching places failed, please try again letter',
			500
		);
		return next(error);
	}

	if (!userWithPlaces || userWithPlaces.places.length === 0) {
		return next(
			new HttpError('Could not find places for the provided user id', 404)
		);
	}
	res.json({
		places: userWithPlaces.places.map((place) =>
			place.toObject({ getters: true })
		)
	});
};

const createPlace = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new HttpError('Invalid inputs passed, please check your data', 422)
		);
	}

	const { title, description, address, creator } = req.body;

	let coordinates;
	try {
		coordinates = await getCoordsForAddress(address);
	} catch (error) {
		return next(error);
	}

	const createdPlace = new Place({
		title,
		description,
		address,
		location: coordinates,
		image: req.file.path,
		creator
	});

	let user;
	try {
		user = await User.findById(creator);
	} catch (err) {
		const error = new HttpError('Creating place failed, please try again', 500);
		return next(error);
	}

	if (!user) {
		const error = new HttpError('Could not find user for the provided id', 404);
		return next(error);
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await createdPlace.save({ session: sess }); // save in the collection as defined on place schema
		user.places.push(createdPlace); // add the place under this user
		await user.save({ session: sess }); // save in the collection as defined on user schema
		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError(
			'Could not create place, please try again',
			500
		);
		return next(error); // if we wouldn't add it the program will continue and we wont to stop it
	}
	res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors);
		return next(
			new HttpError('Invalid inputs passed, please check your data', 422)
		);
	}
	const { title, description } = req.body;
	const placeId = req.params.pid; // {pid:'p1'}

	let place;
	try {
		place = await Place.findById(placeId);
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not find a place',
			500
		);
		return next(error);
	}

	place.title = title;
	place.description = description;

	try {
		await place.save();
	} catch (err) {
		const error = new HttpError(
			'Updating places failed, please try again latter',
			500
		);
		return next(error);
	}
	res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
	const placeId = req.params.pid; // {pid:'p1'}
	let place;
	try {
		place = await Place.findById(placeId).populate('creator');
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not find a place',
			500
		);
		return next(error);
	}

	if (!place) {
		const error = new HttpError(
			'Something went wrong, could not delete place',
			404
		);
		return next(error);
	}

	const imagePath = place.image
	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		await place.remove({ session: sess });
		// place.creator ==> refers to the user on the places schema
		place.creator.places.pull(place); // remove the specific place from the places arr on the user schema
		await place.creator.save({ session: sess });
		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not find a place',
			500
		);
		return next(error);
	}

	fs.unlink(imagePath, err=>{
		console.log(err);
	});
	
	res.status(200).json({ message: 'Deleted place' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;

// const uuid = require('uuid');
// let DUMMY_PLACES = [
// 	{
// 		id: 'p1',
// 		title: 'Empire State Building',
// 		description: 'One of the most famous sky scrapers in the world!',
// 		location: {
// 			lat: 40.7484405,
// 			lng: -73.9878584
// 		},
// 		address: '20 W 34th St, New York, NY 10001',
// 		creator: 'u1'
// 	}
// ];

// throw new HttpError('Invalid inputs passed, please check your data', 422);==> used only in syncronics mode

// const createdPlace = {
// 	id: uuid.v4(),
// 	title,
// 	description,
// 	location: coordinates,
// 	address,
// 	creator
// };
// DUMMY_PLACES.push(createdPlace);
// res.status(201).json({ place: createdPlace });
