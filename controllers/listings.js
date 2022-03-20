const Listing = require('../models/listing');
const mbxStyles = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxStyles({ accessToken: process.env.MAP_TOKEN });
const { cloudinary } = require('../config/cloudinary');

module.exports.index = async (req, res) => {
    const { page = 1 } = req.query;
    const limitSize = 20;
    const size = await Listing.count();
    const pageCount = Math.ceil(size / limitSize);
    const skipDocs = (page - 1) * limitSize;
    const listings = await Listing.find({}).skip(skipDocs).limit(limitSize);
    res.render('listings/home', { listings, pageCount, page });
}


module.exports.renderNewForm = (req, res) => {
    res.render('listings/new');
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render('listings/edit', { listing });
}

module.exports.renderFilteredListing = async (req, res) => {
    const { location } = req.params;
    const re = new RegExp(location, 'i')
    const listings = await Listing.find({ 'location.address': re });
    if (!listings.length) {
        req.flash('error', 'Cannot find that listing');
        return res.redirect('/listings');
    }
    res.render('listings/filter', { listings, location });
}


module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: 'reviews',
        populate: { path: 'owner' }
    }).populate('owner');
    if (!listing) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render('listings/show', { listing })
}

module.exports.createListing = async (req, res) => {
    const listing = new Listing(req.body);
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location.address,
        limit: 1
    }).send();
    listing.geometry = geoData.body.features[0].geometry;
    listing.owner = req.user._id;
    for (let file of req.files) {
        const image = await cloudinary.uploader.upload(file.path, { folder: "airbnb" });
        listing.images.push({ url: image.url, filename: image.original_filename });
    }
    await listing.save();
    req.flash('success', 'Successfully created new listing.');
    res.redirect(`/listings/${listing._id}`);
}


module.exports.editListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body);
    for (let file of req.files) {
        const image = await cloudinary.uploader.upload(file.path, { folder: "airbnb" });
        listing.images.push({ url: image.url, filename: image.original_filename });
    }
    if (listing.location.address !== req.body.location.address) {
        const geoData = await geocoder.forwardGeocode({
            query: req.body.location.address,
            limit: 1
        }).send();
        listing.geometry = geoData.body.features[0].geometry;
    }
    await listing.save();
    if (req.body.deleteImages) {
        await listing.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
    }
    req.flash('success', 'Successfully edited listing.')
    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing Deleted Succesfully');
    res.redirect('/listings')
}

module.exports.search = async (req, res) => {
    const { location } = req.query;
    const re = new RegExp(location, 'i')
    listings = await Listing.find({ "location.address": { $regex: re } });
    if (!listings.length) {
        req.flash('error', 'Cannot find that listing');
        return res.redirect('/listings');
    }
    res.render('listings/filter', { listings, location });
}

