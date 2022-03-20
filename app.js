if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express = require('express');
const app = express();

const mongoose = require('mongoose');
const path = require('path');
const engine = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const AppError = require('./utils/AppError');
const methodOverride = require('method-override')
const passport = require('passport');
const mongoSanitize = require('express-mongo-sanitize');
require('./config/passport');

//Routes
const listingRouter = require('./routes/listings');
const reviewRouter = require('./routes/reviews');
const userRouter = require('./routes/users');
const bookingRouter = require('./routes/bookings');
//Api routes
const coordinateApiRouter = require('./routes/api/coordinates');
const listingApiRouter = require('./routes/api/listings');


mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log('Mongo connected')
    })
    .catch(e => {
        console.log(e);
    })

app.use(mongoSanitize());
app.engine('ejs', engine);
app.use(methodOverride('_method'))
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

store = MongoStore.create({
    collectionName: 'sessions',
    mongoUrl: process.env.DB_URL
})

store.on('error', function(e) {
    console.log('Session store error.', e)
})

app.use(session({
    name: 'session',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        expires: Date.now() + 1000 * 60 * 60 * 24 *7 
    },
    store
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.user = req.user;
    next();
})

app.use('/', userRouter);
app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);
app.use('/listings/:id/bookings', bookingRouter);
//Api routes
app.use('/api/coordinates', coordinateApiRouter);
app.use('/api/listings', listingApiRouter);

const listings = require('./controllers/listings');
const catchAsync = require('./utils/catchAsync');
app.get('/', catchAsync(listings.index))

app.all('*', (req, res, next) => {
    next(new AppError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong';
    res.status(status).render('error', { err })
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening port ${port}`);
})