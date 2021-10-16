const express = require('express');

const pageRoute = require('./routes/pageRoute');

const app = express();

// Template engine
app.set('view engine', 'ejs');

// MIDDLEWARES
app.use(express.static('public'));

// ROUTES
app.use('/', pageRoute);

// app.get('/about', );

const port = 3000;
app.listen(port, () => {
    console.log(`Server is litening on port ${port}`);
});
