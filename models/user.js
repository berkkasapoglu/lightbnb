const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    bookings: [{
        type: Schema.Types.ObjectId,
        ref: 'Booking'
    }]
})

userSchema.pre('save', function(next) {
    const user = this;
    bcrypt.genSalt(function(err, salt) {
        if(err) next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) next(err);
            user.password = hash;
            next();
        })
    })
})

userSchema.methods.comparePassword = async function(plainPassword) {
    return await bcrypt.compare(plainPassword, this.password)
}

userSchema.post('save', (err, doc, next) => {
    if(err.name==='MongoServerError' && err.code === 11000 && err.keyValue.username) {
        next(new Error('Username is already taken. Please choose different one.'));
    } else if(err.name==='MongoServerError' && err.code === 11000 && err.keyValue.email) {
        next(new Error('Email is already taken. Please choose different one.'));
    } 
})

module.exports = mongoose.model('User', userSchema);