const express = require('express');
const { check } = require('express-validator');

const placeControllers = require('../controllers/places-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/:pid', placeControllers.getPlaceById);

router.get('/user/:uid', placeControllers.getPlacesByUserId);

router.post(
	'/',
	fileUpload.single('image'), // looking for the image from the formData (in newPlace)
	[
		check('title').not().isEmpty(),
		check('description').isLength({ min: 5 }),
		check('address').not().isEmpty()
	],
	placeControllers.createPlace
);

router.patch(
	'/:pid',
	[
    check('title').not().isEmpty(), 
    check('description').isLength({ min: 5 })
  ],
	placeControllers.updatePlace
);

router.delete('/:pid', placeControllers.deletePlace);

module.exports = router;

// routes to test on Postmen
// getPlacesByUserId ==> http://localhost:5000/api/places/user/u1
// createPlace ==> http://localhost:5000/api/places
// updatePlace ==> http://localhost:5000/api/places/p1
// deletePlace ==> http://localhost:5000/api/places/p1
