if (process.env.NODE_ENV !== 'production') {
   require('dotenv').config()
}

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const {
   initializePassport,
   saveUsers,
   initializeUsers,
   users,
} = require('./passport-config');
const {
   subscriptions,
   initializeSubscriptions,
   saveSubscriptions,
   sendNewsLetter,
   validateSubscriptionData,
} = require('./public/js/newsletter');

initializePassport(
   passport,
   email => users.find(user => user.email === email),
   id => users.find(user => user.id === id)
)
// set the routes
const shopRouter = require('./src/routes/shop');
const { authRouter, checkAuthenticated, checkNotAuthenticated } = require('./src/routes/auth');

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
app.use(express.urlencoded({ extended: false }));
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

app.get('/', (req, res) => {
   res.render('index', { title: 'Home Page' })
});

app.post('/add-to-newsletter', (req, res) => {
   const name = req.body.name;
   const email = req.body.email;
   const isValid = validateSubscriptionData(name, email);
   if (isValid) { // if the subscription data is valid
      let isInList = false;
      subscriptions.forEach(s => {
         if (s.email === email) {
            isInList = true;
            return;
         }
      })
      if (!isInList) {
         subscriptions.push({ name: name, email: email });
      }
   }
   res.redirect('/');
});

app.get("/sendNewsLetter", (req, res) => {
   if (subscriptions.length) {
      sendNewsLetter()
   }
   res.redirect("/")
});

app.use('/auth', authRouter);
app.use('/', shopRouter);

app.listen(port, () => {
   initializeUsers();
   initializeSubscriptions();

   console.log("server is up\nconnect to: localhost:8000")
});

process.stdin.resume(); // so the program will not close instantly

const exitHandler = (options, exitCode) => {
   saveUsers();
   saveSubscriptions();
   if (options.cleanup) console.log('clean');
   if (exitCode || exitCode === 0) console.log(exitCode);
   if (options.exit) process.exit();
}

// when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

// catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

// catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));