const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const pageRoute = require('./routes/pageRoute');
const courseRoute = require('./routes/courseRoute');
const categoryRoute = require('./routes/categoryRoute'); 
const userRoute = require('./routes/userRoute');

const app = express();

// Conenct DB
mongoose.connect('mongodb://localhost/smartedu-db',{ 
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('DB Connected Successfully!')
}).catch((error) => {
    console.log(error);
});

// Template engine
app.set('view engine', 'ejs');

// Global Variable
global.userIn = null;

// MIDDLEWARES
app.use(express.static('public'));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true})); // for parsing application/x-www-form-urlencoded
app.use(session({
    secret: 'my_keyboard_cat',
    resave: false,
    saveUninitialized: true
}));
app.use('*', (req, res, next) => {
    userIn = req.session.userID;
    next();
});

// ROUTES
app.use('/', pageRoute);
app.use('/courses', courseRoute);
app.use('/categories', categoryRoute);
app.use('/users', userRoute);

// app.get('/about', );

const port = 3000;
app.listen(port, () => {
    console.log(`Server is litening on port ${port}`);
});
