const { render } = require('ejs');
const express = require('express');
const passport = require('../config/ppConfig');
const router = express.Router();
//import the database
const db = require('../models')

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});


router.get('/logout', (req,res)=>{
  req.logOut()//loggs user out of hte session
  req.flash('success', 'logging out and see ya next tiem')
  res.redirect('/')
})

router.post('/signup', (req, res)=>{
  console.log(req.body.name)
  const {email, name, password} = req.body 
  db.user.findOrCreate({
    whwere : {email},
    defaults: {name, password}
  })
  .then(([user, created]) =>{
    if(created) {
      // if created, success and we will redirect back to homepage
      console.log(`${user.name} was created`)
      //flas messeges
      const successObject = {
        successRedirect: '/',
        successFlash: `welcome ${user.name}. account was created`
      }
      //passport authenticate
      passport.authenticate('local',successObject)
    } else {
      //message email already exist
      req.flash('error', 'email already exist')
      res.redirect('/auth/signup')
    }
  })
  .catch (error => {
    console.log('********************error')
    console.log(error)
    req.flash('error', 'email or password is incorrect')
  })
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  successFlash: 'Welcome back ...',
  failureFlash: 'Either email or password is incorrect' 
}));



router.post('')
module.exports = router;
