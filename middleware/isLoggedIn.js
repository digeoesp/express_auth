function isLoggedIn(req, res, next){
    if(!req.user){
        req.flash('error', 'you must be sign in')
    } else {
        next()
    }
}

module.exports = isLoggedIn