var cloudinary = require('cloudinary').v2
const multer = require('multer');

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype==='image/jpeg' || file.mimetype==='image/jpg' || file.mimetype==='image/png') {
        cb(null, true);
    } else {
        cb({message: 'Unsupported file format'}, false);
    }
}

const upload = multer({
    storage: multer.diskStorage({}),
    fileFilter: fileFilter,
    limits: {
        files: 5,
        fileSize: 10485760
    }
});

module.exports = {
    cloudinary,
    upload
}