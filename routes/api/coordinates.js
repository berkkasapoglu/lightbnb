const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require('../../models/listing');

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.status(200).json({
        success: true,
        body: { coordinates:listing.geometry.coordinates, token: process.env.MAP_TOKEN }
    })
})

router.get('/', async (req, res) => {
    const { page = 1 } = req.query;
    const limitSize = 20;
    const skipDocs = (page - 1) * limitSize;
    const listings = await Listing.find({}).skip(skipDocs).limit(limitSize);
    res.status(200).json({
        success: true,
        body: { listings:listings, token: process.env.MAP_TOKEN}
    })
})

module.exports = router;
