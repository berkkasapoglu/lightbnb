const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const opts = { toJSON: { virtuals: true } };

const imageSchema = new Schema({
    filename: String,
    url: String
})

imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200,h_300');
})

const listingSchema = new Schema({
    title: String,
    description: String,
    price: mongoose.Types.Decimal128,
    stayingType: {
        type: String,
        enum: ['Entire home/apt', 'Private room', 'Shared room']
    },
    location: {
        city: String,
        suburb: String,
        country: String,
        address: String
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
        }
    },
    images: [imageSchema],
    numBed: mongoose.Types.Decimal128,
    numRoom: mongoose.Types.Decimal128,
    numBath: mongoose.Types.Decimal128,
    rating: mongoose.Types.Decimal128,
    avgRating: {
        type: mongoose.Types.Decimal128,
        default: 5
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
},opts)

listingSchema.virtual('properties.popUpText').get(function() {
    return `<strong><a href="/listings/${this._id}" class="map-text">${this.title}</a></strong>
     <h4>${this.price} $</h4> 
    `
})

listingSchema.post('findOneAndDelete', async function (doc) {
    if(doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } } )
    }
})

listingSchema.methods.calculateAvgRating = function () {
    let ratingsTotal = 0;
    ratingsTotal = this.reviews.reduce((init, cur) => {
        return init + cur.rating
    }, 0)
    return Math.round((ratingsTotal / this.reviews.length) * 100) / 100;
}



module.exports = mongoose.model('Listing', listingSchema);