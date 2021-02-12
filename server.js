require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const session = require('express-session')
const passport = require('./config/ppConfig')
const flash = require('connect-flash')


const app = express();
const SECRET_SESSION = process.env.SECRET_SESSION
const isLoggedIn = require('./middleware/isLoggedIn')

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);

//session middleware
// secret: What we actually will be giving the user on our site as a session cookie
// resave: Save the session even if it's modified, make this false
// saveUninitialized: If we have a new session, we save it, therefore making that true
const sessionObject = {
  secret: SECRET_SESSION,
  resave: false,
  saveUninitialized: true
}

//middleware
app.use(session(sessionObject));
app.use(passport.initialize())//initialize session
app.use(passport.session())//add a session

/// flash middle ware
app.use(flash())
app.use((req, res, next)=>{
  console.log(res.locals)
  res.locals.alerts = req.flash()
  res.locals.currentUser = req.user
  next()
})





app.get('/', (req, res) => {
  res.render('index');//this is making my views folder index the home page
});

app.get('/profile', isLoggedIn,(req, res) => {
  res.render('profile');
});
//controllers
app.use('/auth', require('./routes/auth'));


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

module.exports = server;
