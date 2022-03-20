const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateListing, isLoggedIn, isValidObjectId, isOwner } = require('../middleware');
const listings = require('../controllers/listings');
const catchAsync = require('../utils/catchAsync');
const { upload } = require('../config/cloudinary');

router.route('/new')
    .get(isLoggedIn, listings.renderNewForm)

router.get('/:id/edit', isLoggedIn, isOwner, isValidObjectId, catchAsync(listings.renderEditForm));

router.route('/')
    .get(catchAsync(listings.index))
    .post(isLoggedIn, upload.array('image'), validateListing, catchAsync(listings.createListing))
    
router.get('/category', catchAsync(listings.search));

router.route('/:id')
    .get(isValidObjectId, catchAsync(listings.showListing))
    .put(isLoggedIn, isOwner, upload.array('image'), validateListing, catchAsync(listings.editListing))
    .delete(isLoggedIn, isOwner, catchAsync(listings.deleteListing))

router.get('/category/:location', catchAsync(listings.renderFilteredListing))

module.exports = router;