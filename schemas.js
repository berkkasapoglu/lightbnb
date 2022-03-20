const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    stayingType: Joi.string().valid('Entire home/apt', 'Private room', 'Shared room'),
    location: Joi.object({
        country: Joi.string().required(),
        city: Joi.string().required(),
        address: Joi.string().required(),
    }).required(),
    numBed: Joi.number().required(),
    numRoom: Joi.number().required(),
    numBath: Joi.number().required(),
    deleteImages: Joi.array()
})

module.exports.reviewSchema = Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().required().min(0).max(5)
})

module.exports.bookingSchema = Joi.object({
    date: Joi.object({
        checkin: Joi.date()
                    .min(new Date(Date.now()-24*60*60*1000))
                    .required(),
        checkout: Joi.date().min(Joi.ref('checkin')).required()
    }).required()
})