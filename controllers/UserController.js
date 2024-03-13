var Category = require('../models/Category');
const User = require('../models/User');
const Faq = require('../models/Faq');
const RecommendCategory = require('../models/RecommendCategory');
const Support = require('../models/Support');
const Training = require('../models/Training');
var nodemailer = require('nodemailer');
// const smtpTransport = require('nodemailer-smtp-transport');
const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Production,
    merchantId: "s4v9y5nc2tyf46xt",
    publicKey: "5fb9srb4qzz2gdkn",
    privateKey: "dce4bafe144194b6e8896116c0dcb63b"
});

const master_email = 'support@social-media-builder.com';
const master_password = '1234567890Aa@';

var transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 587,
    secure : false,
    auth: {
        user: `${master_email}`,
        pass: `${master_password}`
    }
});

exports.info = function(req, res) {
    Training.findOne({type : 'info'}, (err, info) => {
        res.render('pages/user/info', {title : 'CMS | Info', session : req.session, recent_url : req.url, info : info});
    });
}

exports.training = function(req, res) {
    if(req.session.language)
    {
        var language = req.session.language;
    } else {
        var language = 'EN';
    }
    if(req.session.token)
    {
        Training.find({
            type : 'training',
            page_type : 'Userpage',
            language : language
        }, (err, trainings) => {
            if(err) {
                console.log(err);
                res.redirect('/error');
            } else {
                console.log(trainings)
                res.render('pages/user/training', {title : 'CMS | Training', session : req.session, trainings : trainings, recent_url : req.url});
            }
        });
    } else {
        Training.find({
            type : 'training',
            page_type : 'Homepage',
            language : language
        }, (err, trainings) => {
            if(err) {
                console.log(err);
                res.redirect('/error');
            } else {
                console.log(trainings)
                res.render('pages/user/training', {title : 'CMS | Training', session : req.session, trainings : trainings, recent_url : req.url});
            }
        });
    }
    
}

exports.get_training = function(req, res) {
    Training.findById(req.body.training_id, (err, training) => {
        if(err) {
            console.log(err);
            res.redirect('/error');
        } else {
            res.json({training : training});
        }
    })
}

exports.support = function(req, res) {
    res.render('pages/user/support', {title : 'CMS | Support', session : req.session, recent_url : req.url, error : ''});
}

exports.support_save = function(req, res) {
    Support.create({
        name : req.body.name,
        email : req.body.email,
        content : req.body.content
    }, (err) => {
        if(err) {
            console.log(err);
            res.redirect('/error');
        } else {
            console.log(master_email);
            console.log(req.body.email);
            var mailOptions = {
                from: `${master_email}`,
                to: req.body.email,
                subject: 'Support',
                text: 'Thank you for your support.'
              };
              
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                    res.render('pages/user/support', {title : 'CMS | Support', session : req.session, recent_url : req.url, error : `${error}`});
                } else {
                    console.log('Email sent: ' + info.response);
                    var mail = `Name : ${req.body.name}
                                Email : ${req.body.email}
                                ${req.body.content}`;
                    var mailOptions = {
                        from: req.body.email,
                        to: `${master_email}`,
                        subject: 'Support',
                        text: mail
                    };
                    
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                            res.render('pages/user/support', {title : 'CMS | Support', session : req.session, recent_url : req.url, error : `${error}`});
                        } else {
                            console.log('Email sent: ' + info.response);
                            res.redirect('/support');
                        }
                    });
                }
            });
            
        }
    })
}

exports.search = function(req, res, next) {
    res.render('pages/user/search', {title : 'CMS | Search', session : req.session, recent_url : req.url});
}

exports.search_all = function(req, res) {
    Category.find({
        language : req.session.language
    }, (err, categories) => {
        if(err) {
            console.log(err);
            res.redirect('/error');
        } else {
            res.json({categories : categories});
        }
    }).sort({name : 1});
}
exports.get_category = function(req, res) {
    if(req.body.keyword == ''){
        Category.find({
            language : req.session.language
        }, (err, categories) => {
            if(err) {
                console.log(err);
                res.redirect('/error');
            } else {
                res.json({categories : categories});
            }
        }).sort({name : 1});
    } else {
        Category.find({
            language : req.session.language
        }, (err, categories) => {
            if(err) {
                console.log(err);
                res.redirect('/error');
            }else {
                var new_categories = Array();
                for(var i = 0 ; i < categories.length ; i ++) 
                {
                    if(categories[i].name.toLowerCase().match(req.body.keyword.toLowerCase()+'.*') || categories[i].name.toLowerCase().match('^.*'+req.body.keyword.toLowerCase())) 
                    {
                        new_categories.push(categories[i]);
                    }
                }
                res.json({categories : new_categories});
            }
        });
    }
    
}

exports.faq = function(req, res) {
    Category.find({
        language : req.session.language
    }, (err, categories) => {
        if(err) {
            console.log(err);
            res.redirect('/error');
        } else {
            
            Faq.find({
                language : req.session.language
            }, (err, faqs) => {
                if(err) {
                    console.log(err);
                    res.redirect('/error');
                } else {
                    res.render('pages/user/faq', {title : 'CMS | FAQ', session : req.session, faqs : faqs, categories : categories, recent_url : req.url});
                }
            })
            
        }
    })
    
}

exports.get_faqs = function(req, res) {
    Faq.find({category : req.body.category}, (err, faqs) => {
        if(err) {
            console.log(err);
            res.redirect('/error');
        } else {
            res.json({ faqs : faqs});
        }
    })
}

exports.recommend_category = function(req, res) {
    Category.find({}, (err, categories) => {
        if(err) {
            console.log(err);
            res.redirect('/error');
        } else {
            res.render('pages/user/recommend_category', { title : 'CMS | Recommend Category', session : req.session, categories : categories, recent_url : req.url, error : ''});
        }
    })
    
}

exports.recommend_category_save = function(req, res) {
    RecommendCategory.create({
        category : req.body.category,
        email : req.body.email,
        content : req.body.content
    }, (err) => {
        if(err) {
            console.log(err);
            res.redirect('/error');
        } else {
            var mailOptions = {
                from: `${master_email}`,
                to: req.body.email,
                subject: 'Recommend Category',
                html: 'Thank you for your recommendation.'
              };
              
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                    Category.find({}, (err, categories) => {
                        if(err) {
                            console.log(err);
                        } else {
                            res.render('pages/user/recommend_category', { title : 'CMS | Recommend Category', session : req.session, categories : categories, recent_url : req.url, error : `${error}`});
                        }
                    })
                } else {
                    console.log('Email sent: ' + info.response);
                    var mail = `Category : ${req.body.category}
                                Email : ${req.body.email}
                                ${req.body.content}`;
                    var mailOptions = {
                        from: req.body.email,
                        to: `${master_email}`,
                        subject: 'Recommend Category',
                        html: mail
                    };
                    
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                            Category.find({}, (err, categories) => {
                                if(err) {
                                    console.log(err);
                                } else {
                                    res.render('pages/user/recommend_category', { title : 'CMS | Recommend Category', session : req.session, categories : categories, recent_url : req.url, error : `${error}`});
                                }
                            })
                        } else {
                            console.log('Email sent: ' + info.response);
                            res.redirect('/recommend_category');
                        }
                    });
                }
            });
            
        }
    })
}

exports.ask_for_post = function(req, res) {
    Category.find({
        language : req.session.language
    }, (err, categories) => {
        if(err) {
            console.log(err);
            res.redirect('/error');
        } else {
            res.render('pages/user/ask_for_post', {title : 'CMS | Ask for a post', session : req.session, categories : categories, recent_url : req.url});
        }
    });    
}

exports.ask_for_post_save = function(req, res) {
    Faq.create({
        language : req.session.language,
        title : req.body.title,
        category : req.body.category,
        email : req.body.email,
        content : req.body.content
    }, (err) => {
        if(err) {
            console.log(err);
            res.redirect('/error');
        } else {
            User.findById(req.session.userid, (err, user) => {
                if(err) {
                    console.log(err);
                    res.redirect('/error');
                } else {
                    User.findByIdAndUpdate(req.session.userid, { $set : {
                        ask : user.ask - 1
                    }}, (err) => {
                        if(err) {
                            console.log(err);
                            res.redirect('/error');
                        } else {
                            req.session.ask = user.ask - 1;
                            res.redirect('/faq');
                        }
                    });
                }
            })
            
        }
    })
}


exports.membership_update = function(req, res) {
    if(req.body.membership > 1) {
        var split_cardnum = req.body.cardnumber.split(' ');
        var cardnumber = '';
        for(var i = 0 ; i < split_cardnum.length ; i ++) 
        {
            cardnumber = cardnumber + split_cardnum[i];
        }

        gateway.transaction.sale({
            amount: `${req.body.amount}`,
            paymentMethodNonce: "fake-valid-nonce",
            options: {
              submitForSettlement: true,
              storeInVaultOnSuccess: true
            }
          }, function (err, result) {
            if (err) {
              // handle err
              res.redirect('/error');
            }
          
            if (result.success) {
              console.log('Transaction ID: ' + result.transaction.id);
              console.log('Customer ID: ' + result.transaction.customer.id);
                var customer_id = result.transaction.customer.id;
                let creditCardParams = {
                    customer_id,
                    number: `${cardnumber}`,
                    expirationDate: `${req.body.month}/${req.body.year}`,
                    cvv: `${req.body.cvc}`
                  };
                  
                  gateway.creditCard.create(creditCardParams, (err, response) => {
                      if(err) {
                          console.log(err);
                          res.redirect('/error');
                      } else {
                        console.log(response);

                        if(response.success === true)
                        {
                            if(req.body.membership == 1) {
                                var ask = 0;
                            }
                            if(req.body.membership == 2 || req.body.membership == 3) {
                                var ask = 1;
                            }
                            if(req.body.membership == 1) {
                                var ask = 2;
                            }
                            var old_membership = req.session.membership;
                            var today = new Date();
                            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+ ' ' + today.getHours()+':'+today.getMinutes()+':'+today.getSeconds()+'.'+today.getMilliseconds();
                            User.findByIdAndUpdate(req.session.userid, {$set : {
                                membership : req.body.membership,
                                ask : ask,
                                created_at : date,
                                card_number : req.body.cardnumber,
                                expire_month : req.body.month,
                                expire_year : req.body.year,
                                cvc : req.body.cvc,
                                started_at : date
                            }}, (err) => {
                                if(err) {
                                    console.log(err);
                                } else {
                                    req.session.membership = req.body.membership;
                                    req.session.left_membership = req.body.membership;
                                    req.session.card_number = req.body.cardnumber;
                                    req.session.expire_month = req.body.month;
                                    req.session.expire_year = req.body.year;
                                    req.session.cvc = req.body.cvc;
                                    console.log(req.body)
                                    res.json({msg : 'success', old_membership : old_membership, date: date});
                                    
                                }
                            })
                        } else {
                            res.json({msg : 'failed', error_msg : response.message});
                        }
                        
                      }
                  });
            } else {
              console.error(result.message);
              res.redirect('/error');
            }
        });
    }
    
}