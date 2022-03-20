const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateBooking, isLoggedIn, isBookingExist } = require('../middleware');
const bookings = require('../controllers/bookings');
const catchAsync = require('../utils/catchAsync');


router.post('/', isLoggedIn, validateBooking, isBookingExist, catchAsync(bookings.createBooking))

module.exports = router;