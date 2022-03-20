const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Listing'
    },
    date: {
        checkin: {
            type: Date,
            required: true
        },
        checkout: {
            type: Date,
            required: true
        }
    }
})

module.exports = mongoose.model('Booking', bookingSchema);