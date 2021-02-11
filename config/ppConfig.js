const passport  = require('passport')
const localStrategy = require('passport-local').Strategy

//database model
const db = require('../models')//grabs the datatbase for models


//passport serialize info to be able to loging
passport.serializeUser((user, cb)=>{
    cb(null, user.id)
})

passport.deserializeUser((id, cb)=>{
    db.user.findByPk(id)
    .then(user =>{
        if(user){
            cb(null, user)
        }
    })
    .catch(error =>{
        console.log('yo.. there is an error')
        console.log(error)
    })
})

passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, cb)=> {
    db.user.findOne({
      where: {email}  
    })
    .then(user => {
        if(!user || !user.validPassword(password)){
            cb(null, false)
        } else {
            cb(null, user)
        }
    })
    .catch(error =>{
        console.log('*************error')
        console.log(error)
    })
}))

module.exports = passport