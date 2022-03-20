const { listingSchema, reviewSchema, bookingSchema } = require('./schemas');
const AppError = require('./utils/AppError');
const ObjectId = require('mongoose').Types.ObjectId;
const Review = require('./models/review');
const Listing = require('./models/listing');
const Booking = require('./models/booking');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        if (req.method === 'POST') {
            req.session.returnTo = req.headers.referer;
        } else {
            req.session.returnTo = req.originalUrl;
        }
        req.flash('error', 'You must logged in');
        return res.redirect('/login');
    }
    next();
}

module.exports.isValidObjectId = (req, res, next) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        req.flash('error', 'Cannot find that data.')
        return res.redirect('/listings');
    }
    next();
}


module.exports.isReviewOwner = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!req.user._id.equals(review.owner._id)) {
        req.flash('error', "You don't have permission to delete this review.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!req.user._id.equals(listing.owner._id)) {
        req.flash('error', "You are not host of this listing.");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        return next(new AppError(msg, 404));
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        return next(new AppError(msg, 404));
    } else {
        next();
    }
}

module.exports.validateBooking = (req, res, next) => {
    const { error } = bookingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        return next(new AppError(msg, 404));
    } else {
        next();
    }
}

module.exports.isBookingExist = async (req, res, next) => {
    const { id } = req.params;
    const { checkin, checkout } = req.body.date;
    console.log(checkin)
    const booking = await Booking.find({
        place: id,
        $or: [
            {
                $and: [
                    { "date.checkin": { $gte: new Date(checkin) } },
                    { "date.checkin": { $lte: new Date(checkout) } }
                ]
            },
            { "date.checkin": { $lte: new Date(checkin) }, "date.checkout": { $gte: new Date(checkin) } },
            { "date.checkin": { $lt: new Date(checkout) }, "date.checkout": { $gt: new Date(checkout) } }
        ]
    });
    if (booking.length) return next(new AppError('This staying has already been booked'));
    next();
}