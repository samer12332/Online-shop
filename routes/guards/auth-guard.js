isAuth = (req, res, next) => {
    if(req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
}

notAuth = (req, res, next) => {
    if(!req.session.userId) {
        next();
    } else {
        res.redirect('/')
    }
}


module.exports = {
    isAuth, 
    notAuth
}











