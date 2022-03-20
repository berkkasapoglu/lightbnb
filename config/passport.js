const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user');

const verifyCallback = (username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Incorrect username or password.' }); }
        if (!user.comparePassword(password)) { return done(null, false, { message: 'Incorrect username or password.' }); }
        return done(null, user);
    })
}

passport.use(new LocalStrategy(verifyCallback));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId).populate('bookings')
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err))
});