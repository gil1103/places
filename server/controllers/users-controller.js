const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
	let users;
	try {
		users = await User.find({}, '-password');
	} catch (err) {
		const error = new HttpError(
			'Fetching users failed, please try again later',
			500
		);
		return next(error);
	}
	res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors);
		const error = new HttpError(
			'Invalid inputs passed, please check your data',
			422
		);
		return next(error); // for async funcion
		// for synco function throw new HttpError('Invalid inputs passed, please check your data', 422);
	}
	const { name, email, password } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError(
			'Signing up failed, please try again later.',
			500
		);
		return next(error);
	}

	if (existingUser) {
		const error = new HttpError(
			'User exists already, please login instead ',
			422
		);
		return next(error);
	}

	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hash(password, 12);
	} catch (err) {
		const error = new HttpError('Could not create user, please try again', 500);
		return next(error);
	}

	const createdUser = new User({
		name,
		email,
		image: req.file.path,
		password: hashedPassword,
		places: []
	});

	try {
		await createdUser.save(); // save in the collection as defined on product schema
	} catch (err) {
		const error = new HttpError('Signed up failed, please try again', 500);
		return next(error); // if we wouldn't add it the program will continue and we wont to stop it
	}
	res.status(201).json({ user: createdUser.toObject({ getters: true }) }); // remove the underscore from the id to allow easy access later
};

const login = async (req, res, next) => {
	const { email, password } = req.body;

	let identifiedUser;
	try {
		identifiedUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError(
			'Logging in failed, please try again later.',
			500
		);
		return next(error);
	}

	if (!identifiedUser) {
		const error = new HttpError(
			'Invalid credentials, could not log you in',
			401
		);
		return next(error);
	}

	let isValidPassword = false;

	try{
		isValidPassword = await bcrypt.compare(password, identifiedUser.password);
	}catch(err){
		const error = new HttpError('Could not log you in, please check your credentials and try again',500)
	}

	res.json({
		message: 'Logged in!',
		user: identifiedUser.toObject({ getters: true })
	});
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;

// const uuid = require('uuid');
// const DUMMY_USERS = [
// 	{
// 		id: 'u1',
// 		name: 'Gil Hershhovitz',
// 		email: 'test@test.com',
// 		password: 'testers'
// 	}
// ];
