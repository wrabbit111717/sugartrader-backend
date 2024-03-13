exports.index = function(req, res, next) {
    if(req.session.permission == 1) {
        next();
    } else {
        res.redirect('/');
    }
}