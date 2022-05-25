const express = require('express');
const { check } = require('express-validator');

const userControllers = require('../controllers/users-controller')
const fileUpload = require('../middleware/file-upload')

const router = express.Router();

router.get('/',userControllers.getUsers);

router.post(
	'/signup',
	fileUpload.single('image'), // looking for the image key
	[
		(check('name').not().isEmpty(),
		check('email').normalizeEmail().isEmail(),
		check('password').isLength({ min: 6 }))
	],
	userControllers.signup
);

router.post('/login',userControllers.login)

module.exports = router;

// routes to test on Postmen

// getUsers ==> http://localhost:5000/api/users
// signup ==> http://localhost:5000/api/users/signup
// /login ==> http://localhost:5000/api/users/login