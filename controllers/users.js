const User = require('../models/user');

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        const newUser = await user.save();
        if(newUser) {
            req.login(newUser, err => {
                if(err) next(err);
                req.flash('success', 'Welcome to the lightbnb');
            })
        }
        res.redirect('/listings');
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
    
}

module.exports.login = (req, res) => {
    req.flash('success', 'Succesfully signed in.');
    const redirectUrl = req.session.returnTo || '/listings';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Good Bye..');
    res.redirect('/listings');
}

module.exports.showUserTrips = async (req, res) => {
    const user = await User.findById(req.user._id).populate({
        path: 'bookings',
        populate: { 
            path: 'place',
            populate: {
                path: 'owner'
            }
        },
    })
    res.render('users/trips', { user });
}