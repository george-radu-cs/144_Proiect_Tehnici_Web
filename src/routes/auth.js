const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const authRouter = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const { passwordHelper, saveUsers, users } = require('../../passport-config');

/* we need these 2 functions to know when a user is authenticated or not, not
 * all the page should be accessed if a user is not logged (in our case
 * test_login, but other examples like a page where the user change his
 * profile, add an address etc.) and nor if a user is logged in(we don't want
 * a user to login twice, or register again) */
const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/auth/login')
}
const checkNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}
authRouter.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register', { title: 'Register', layout: 'layouts/layout_info' })
});

authRouter.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login', { title: 'Login', layout: 'layouts/layout_info' })
});

authRouter.post('/register', checkNotAuthenticated, urlencodedParser, [
  check('username', 'The username must be 3+ characters long')
    .exists()
    .isLength({ min: 3 }),

  check('username', 'The username must be 20 characters long')
    .exists()
    .isLength({ max: 20 }),

  check('email', 'Emails is not valid')
    .exists()
    .isEmail()
    .normalizeEmail()
], async (req, res) => {
  let errors = validationResult(req);

  const pass = req.body.password;
  const pass1 = req.body.password1;
  const email = req.body.email;

  if (pass.length < 6) {
    errors.errors.push({ value: '', msg: 'Password must be at least 6 characters long', param: 'email', location: 'body' })
  }
  if (pass.length >= 21) {
    errors.errors.push({ value: '', msg: 'Password must have max 20 characters', param: 'email', location: 'body' })
  }

  if (pass !== pass1) {
    errors.errors.push({ value: '', msg: 'Passwords doesn\'t match, Try again!', param: 'email', location: 'body' })
  }

  // we don't need this anymore since we have passwordHelper
  // var regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})");
  // if (!(regex.test(pass))) {
  //    errors.errors.push({ value: '', msg: 'Password should be at least 6chars long, contain at least one lowercase and one uppercase letter, and one special char: !@#\$%\^&\*', param: 'email', location: 'body' })
  // }

  if (!errors.isEmpty()) {
    const alert = errors.array();
    res.render('register', { alert, title: 'Register', layout: 'layouts/layout_info' });
  }
  else {
    try {
      const hashedPassword = await bcrypt.hash(pass + passwordHelper + email, 10);
      users.push({
        id: Date.now().toString(),
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
      })
      res.redirect('/auth/login');
      saveUsers();
    }
    catch {
      res.redirect('/auth/register');
    }
  }
});

authRouter.post('/login', passport.authenticate('local', {
  successRedirect: '/auth/test_login',
  failureRedirect: '/auth/login',
  failureFlash: true
}));

authRouter.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
})

authRouter.get('/test_login', checkAuthenticated, (req, res) => {
  res.render('test_login', { title: 'Test Login', name: req.user.username, layout: 'layouts/layout_info' })
});

module.exports = { authRouter, checkAuthenticated, checkNotAuthenticated };