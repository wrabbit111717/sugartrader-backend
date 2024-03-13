var Industry = require('../models/Industry');
exports.save = function(req, res, next) {
    Industry.create({
        name : req.body.name,
    }, (err, industry) => {
        if(err){
            res.redirect('/error');
        } else {
            res.status(200).send({ industry : industry });
        }
    });
}