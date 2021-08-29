const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const fs = require('fs');
const passwordHelper = process.env.PASSWORD_HELPER; // something random to add when encrypting the password
const users = [];

const initializePassport = (passport, getUserByEmail, getUserById) => {
   const authenticateUser = async (email, password, done) => {
      const user = getUserByEmail(email);
      if (user == null) {
         return done(null, false, { message: 'No user with that email' });
      }

      try {
         if (await bcrypt.compare(password + passwordHelper + email, user.password)) {
            return done(null, user);
         } else {
            return done(null, false, { message: 'Password incorect' });
         }
      }
      catch (e) {
         return done(e)
      }
   }

   passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
   passport.serializeUser((user, done) => done(null, user.id));
   passport.deserializeUser((id, done) => {
      return done(null, getUserById(id))
   });
}

const saveUsers = () => {
   const jsonContent = JSON.stringify(users)
   fs.writeFileSync(__dirname + "/data/users.json", jsonContent, 'utf8', (err) => {
      if (err) {
         console.log("An error occured while saving the users.");
         return console.log(err);
      }
   });

   console.log("The users data was saved successfully.");
}

const initializeUsers = () => {
   fs.readFile(__dirname + "/data/users.json", 'utf-8', (err, jsonString) => {
      if (err) {
         console.log("Error reading users from the disk. Please reload", err);
         return;
      }
      try {
         users.push(...JSON.parse(jsonString));
      } catch (err) {
         console.log("Error parsing JSON string for users:", err);
         console.log("Please reload!");
      }
   });
}

module.exports = { initializePassport, passwordHelper, saveUsers, initializeUsers, users }