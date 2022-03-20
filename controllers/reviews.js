const Listing = require('../models/listing');
const Review = require('../models/review');

module.exports.createReview = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews');
    const review = new Review(req.body);
    review.date = new Date();
    review.owner = req.user._id;
    listing.reviews.push(review);
    listing.avgRating = listing.calculateAvgRating();
    await review.save();
    await listing.save();
    req.flash('success', 'Added new review.')
    res.redirect(`/listings/${id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash('success', 'Review deleted successfully');
    res.redirect(`/listings/${id}`);
}