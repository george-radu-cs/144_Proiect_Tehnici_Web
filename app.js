const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = new express();
const port = 8000;

// static files -> load the css, js and where to find the images
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/img', express.static(__dirname + 'public/img'));

// set the template engine to use
app.set('views', './src/views')
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set('layout', './layouts/layout')

// set the routes
const shopRouter = require('./src/routes/shop');

app.use('/', shopRouter);

app.listen(port, () => {console.log("server is up\nconnect to: localhost:8000")});
