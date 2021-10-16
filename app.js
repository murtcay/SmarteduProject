const express = require('express');
const mongoose = require('mongoose');

const pageRoute = require('./routes/pageRoute');
const courseRoute = require('./routes/courseRoute');

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

// MIDDLEWARES
app.use(express.static('public'));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true})); // for parsing application/x-www-form-urlencoded

// ROUTES
app.use('/', pageRoute);
app.use('/courses', courseRoute);

// app.get('/about', );

const port = 3000;
app.listen(port, () => {
    console.log(`Server is litening on port ${port}`);
});
