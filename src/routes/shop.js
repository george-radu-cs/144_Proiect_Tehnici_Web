const express=require('express');
const expressLayouts = require('express-ejs-layouts');
const shopRouter = express.Router();

shopRouter.get('', async (req, res) => {
    res.render('index', {title: 'Home Page'})
});

shopRouter.get('/list_products', (req, res) => {
    res.render('list_products', {title: 'List products', layout: 'layouts/layout_sell'})
});

shopRouter.get('/product', (req, res) => {
    res.render('product', {title: 'Product', layout: 'layouts/layout_sell'})
});

// pages for about us
shopRouter.get('/about_us', (req, res) => {
    res.render('partials/about_us/about_us', {title: 'About Us', layout: 'layouts/layout_sell'});
});
shopRouter.get('/contact', (req, res) => {
    res.render('partials/about_us/contact', {title: 'Contact Us', layout: 'layouts/layout_sell'});
});
shopRouter.get('/who_we_are', (req, res) => {
    res.render('partials/about_us/who_we_are', {title: 'Who we are', layout: 'layouts/layout_sell'});
});
shopRouter.get('/hiring', (req, res) => {
    res.render('partials/about_us/hiring', {title: 'Hiring', layout: 'layouts/layout_sell'});
});
shopRouter.get('/shops', (req, res) => {
    res.render('partials/about_us/shops', {title: 'Shops', layout: 'layouts/layout_sell'});
});

// pages for customer service
shopRouter.get('/customer_service', (req, res) => {
    res.render('partials/customer_service/customer_service', {title: 'Customer Service', layout: 'layouts/layout_sell'});
});
shopRouter.get('/frequent_questions', (req, res) => {
    res.render('partials/customer_service/frequent_questions', {title: 'Frequent questions', layout: 'layouts/layout_sell'});
});
shopRouter.get('/guarantee', (req, res) => {
    res.render('partials/customer_service/guarantee', {title: 'Guarantee', layout: 'layouts/layout_sell'});
});
shopRouter.get('/payment_methods', (req, res) => {
    res.render('partials/customer_service/payment_methods', {title: 'Payment methods', layout: 'layouts/layout_sell'});
});
shopRouter.get('/retur', (req, res) => {
    res.render('partials/customer_service/retur', {title: 'Retur Policy', layout: 'layouts/layout_sell'});
});

// pages for legal
shopRouter.get('/legal', (req, res) => {
    res.render('partials/legal/legal', {title: 'Legal', layout: 'layouts/layout_sell'});
});
shopRouter.get('/cookie_policy', (req, res) => {
    res.render('partials/legal/cookie_policy', {title: 'Cookie policy', layout: 'layouts/layout_sell'});
});
shopRouter.get('/privacy', (req, res) => {
    res.render('partials/legal/privacy', {title: 'Privacy', layout: 'layouts/layout_sell'});
});
shopRouter.get('/terms_and_conditions', (req, res) => {
    res.render('partials/legal/terms_and_conditions', {title: 'Terms and conditions', layout: 'layouts/layout_sell'});
});

// handle the 404 error
shopRouter.use('*', (req, res) => {
    res.render("error", {title: "404 Page not found!", layout: 'layouts/layout_sell'});
});

// handle the 500 error
shopRouter.use((req, res) => {
    res.render("error", {title: "500 Internal server error!", layout: 'layouts/layout_sell'});
});

module.exports = shopRouter;
