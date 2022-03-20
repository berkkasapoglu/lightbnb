const express = require('express');
const router = express.Router({mergeParams: true});
const Booking = require('../../models/booking');

router.get('/:id/booking', async (req, res) => {
    const { id } = req.params;
    const booking = await Booking.find({ place: id });
    res.status(200).json(booking);
})

module.exports = router;