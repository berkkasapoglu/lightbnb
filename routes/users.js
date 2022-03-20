const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const users = require('../controllers/users');
const { isLoggedIn } = require('../middleware');
const catchAsync = require('../utils/catchAsync');

router.route('/login')
    .get(users.renderLoginForm)
    .post(
        passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
        users.login
        )

router.route('/register')
    .get(users.renderRegisterForm)
    .post(catchAsync(users.createUser))

router.get('/logout', users.logout)

router.get('/trips', isLoggedIn, catchAsync(users.showUserTrips))


module.exports = router;
