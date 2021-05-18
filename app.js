if (process.env.NODE_ENV !== 'production') {
   require('dotenv').config()
}

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const initializePassport = require('./passport-config')
initializePassport(
   passport,
   email => users.find(user => user.email === email),
   id => users.find(user => user.id === id)
)

users = [];

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
app.use(express.urlencoded({extended: false}));
app.set('layout', './layouts/layout')
app.use(flash())
app.use(session({
   secret: process.env.SESSION_SECRET,
   resave: false,
   saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

const urlencodedParser = bodyParser.urlencoded({extended: false});

// set the routes
const shopRouter = require('./src/routes/shop');

app.get('/', (req, res) => {
   res.render('index', {title: 'Home Page'})
});

app.get('/test_login', checkAuthenticated, (req, res) => {
   res.render('test_login', {title: 'Test Login', name: req.user.username, layout: 'layouts/layout_sell'})
});

app.get('/register', checkNotAuthenticated, (req, res) => {
   res.render('register', {title: 'Register', layout: 'layouts/layout_sell'})
});

app.get('/login', checkNotAuthenticated, (req, res) => {
   res.render('login', {title: 'Login', layout: 'layouts/layout_sell'})
});

app.post('/register', checkNotAuthenticated, urlencodedParser, [
   check('username', 'The username must be 3+ characters long')
      .exists()
      .isLength({min: 3}),

   check('username', 'The username must be 20 characters long')
      .exists()
      .isLength({max: 20}),

   check('email', 'Emails is not valid')
      .exists()
      .isEmail()
      .normalizeEmail()
], async (req, res) => {
   let errors = validationResult(req);

   const pass = req.body.password;
   const pass1 = req.body.password1;

   // console.log(errors)

   if (pass.length <= 6) {
      errors.errors.push({value: '', msg: 'Password must be at least 6 characters long', param: 'email', location: 'body'})
   }
   if (pass.length >= 21) {
      errors.errors.push({value: '', msg: 'Password must have max 20 characters', param: 'email', location: 'body'})
   }

   if (pass !== pass1) {
      errors.errors.push({value: '', msg: 'Passwords doesn\'t match, Try again!', param: 'email', location: 'body'})
   }

   var regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})");
   if (!(regex.test(pass))) {
      errors.errors.push({value: '', msg: 'Password should be at least 6chars long, contain at least one lowercase and one uppercase letter, and one special char: !@#\$%\^&\*', param: 'email', location: 'body'})
   }

   // console.log(errors) //->for testing

   if (!errors.isEmpty()) {
      const alert = errors.array();
      res.render('register', {alert, title: 'Register', layout: 'layouts/layout_sell'});
   }
   else {
      // todo save to users
      try {
         const hashedPassword = await bcrypt.hash(pass, 10);
         users.push({
            id: Date.now().toString(),
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
         })
         res.redirect('/login');
      }
      catch {
         res.redirect('/register');
      }
   }
   console.log(users);
});

app.post('/login', passport.authenticate('local', {
   successRedirect: '/test_login',
   failureRedirect: '/login',
   failureFlash: true
}));
// res.render('index', {title: 'Home Page'})

app.delete('/logout', (req, res) => {
   req.logOut();
   res.redirect('/');
})

app.use('/', shopRouter);

function checkAuthenticated(req, res, next) {
   if (req.isAuthenticated()) {
      return next()
   }
   res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
   if (req.isAuthenticated()) {
      return res.redirect('/')
   }
   next()
}

app.listen(port, () => {console.log("server is up\nconnect to: localhost:8000")});
