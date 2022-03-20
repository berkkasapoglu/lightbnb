const Booking = require('../models/booking');
const Listing = require('../models/listing');
const User = require('../models/user');

module.exports.createBooking = async (req, res) => {
    const { id } = req.params;
    const booking = new Booking(req.body);
    listing = await Listing.findById(id);
    booking.place = listing._id;
    const user = await User.findById(req.user._id);
    user.bookings.push(booking);
    await booking.save();
    await user.save();
    req.flash('success', 'Your reservation has been confirmed');
    res.redirect(`/listings/${id}`);
}