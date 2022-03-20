const mongoose = require('mongoose');
const listingItems = require('./listings.json');
const Listing = require('../models/listing');
const Review = require('../models/review');
const User = require('../models/user');
const axios = require('axios');
const { cloudinary } = require('../config/cloudinary');

mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log('Mongo connected')
    })
    .catch(e => {
        console.log(e);
    })

const uploadImage = async (file) => {
    const image = await cloudinary.uploader.upload(file, { folder: "airbnb" });
    return image;
}

const getImages = async (folder) => {
    const images = await cloudinary.search.expression('airbnb').max_results(200).execute();
    return images;
}

const getReviews = async (idx) => {
    const reviews = [];
    for (let i = 0; i < 3; i++) {
        const review = listingItems[idx].reviews[i];
        if (review) {
            const res = await axios.get("https://random-data-api.com/api/users/random_user");
            const user = res.data;
            const newUser = new User({
                username: user.username,
                password: user.password,
                email: user.email
            })
            await newUser.save();
            const addedReview = new Review({
                date: new Date(review.date.$date),
                body: review.comments,
                rating: Math.floor(Math.random() * 4) + 2,
                owner: newUser._id
            });
            await addedReview.save();
            reviews.push(addedReview);
        }
    }
    return reviews;
}

const seedDb = async () => {
    await Listing.deleteMany({});
    await Review.deleteMany({});
    const images = await getImages('airbnb');
    for (let i = 0; i < 49; i++) {
        // let image;
        for (let j = 0; j < 4; j++) {
            // const randomNumber = Math.floor(Math.random()*10)
            // image = await uploadImage(`https://source.unsplash.com/collection/8253727/${randomNumber}`);
        }
        const listing = new Listing({
            title: listingItems[i].name,
            description: listingItems[i].summary,
            price: listingItems[i].price,
            stayingType: listingItems[i].room_type,
            location: {
                city: listingItems[i].address.market,
                country: listingItems[i].address.country,
                address: listingItems[i].address.suburb + ',' + listingItems[i].address.street
            },
            geometry: listingItems[i].address.location,
            images: [
                {
                    filename: 'airbnb/' + images.resources[4*i+1].filename,
                    url: images.resources[4*i+1].url
                },
                {
                    filename: 'airbnb/' + images.resources[4*i+2].filename,
                    url: images.resources[4*i+2].url
                },
                {
                    filename: 'airbnb/' + images.resources[4*i+3].filename,
                    url: images.resources[4*i+3].url
                },
                {
                    filename: 'airbnb/' + images.resources[4*i+4].filename,
                    url: images.resources[4*i+4].url
                }],
            numBed: listingItems[i].beds,
            numRoom: listingItems[i].accommodates,
            numBath: listingItems[i].bathrooms,
            reviews: await getReviews(i),
            owner: mongoose.Types.ObjectId('623638b3a48e65d43457ba0d')
        })
        listing.avgRating = listing.calculateAvgRating();
        await listing.save();
    }
    console.log('Data Inserted');
}

seedDb();

