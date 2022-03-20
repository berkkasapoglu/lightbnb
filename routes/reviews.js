const express = require('express');
const reviews = require('../controllers/reviews');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isReviewOwner } = require('../middleware');
const { validateReview } = require('../middleware');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));
router.delete('/:reviewId', isLoggedIn, isReviewOwner, catchAsync(reviews.deleteReview));
module.exports = router;