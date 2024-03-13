var Industry = require('../models/Industry');
var User = require('../models/User');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var path = require('path');
const multer = require("multer");
var Post = require('../models/Post');
var fs = require('fs');
const braintree = require("braintree");
const crypto = require('crypto');
var nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const root_dir = '/CMS_with_node/';

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

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Production,
  merchantId: "s4v9y5nc2tyf46xt",
  publicKey: "5fb9srb4qzz2gdkn",
  privateKey: "dce4bafe144194b6e8896116c0dcb63b"
});

exports.login = function (req, res, next) {
    console.log(req.url)
    res.render('pages/auth/login', { title: 'CMS | Login', errors: [], session: req.session, recent_url : req.url });
}

exports.register = function (req, res, next) {
    Industry.find({}, (err, industries) => {
        if (err) {
            res.redirect('/error');
        } else {
            res.render('pages/auth/register', { title: "CMS | Register", industries: industries, session: req.session, recent_url : req.url });
        }
    })
}

exports.forgotpassword = function (req, res) {
    res.render('pages/auth/forgotpassword', { title: 'CMS | Forgot Password', session: req.session, recent_url : req.url});
}

exports.signup = async function (req, res, next) {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const confirm_password = req.body.confirmPassword;
        const errors = [];

        // Validate input data
        if (!name || name.length < 3) {
            errors.push('Name must be at least 3 characters.');
        }

        // Validate other fields...

        if (password.length < 6) {
            errors.push('Password must be at least 6 characters.');
        }

        if (confirm_password !== password) {
            errors.push('Passwords do not match.');
        }

        if (!email) {
            errors.push('Email is required.');
        } else {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                errors.push('Email is already registered.');
            }
        }

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            // Add other fields as needed...
        });

        // Save the user to the database
        await newUser.save();

        const verificationToken = crypto.randomBytes(20).toString('hex');
        
        // Update user model with verification token
        newUser.verificationToken = verificationToken;

        // Save the user to the database
        await newUser.save();

        console.log(newUser, 'newUser')
        // Send verification email
        sendVerificationEmail(newUser.email, verificationToken);

        // Return a success response
        return res.status(201).json({ message: 'User registered successfully. Check your email for verification.' });

    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

function sendVerificationEmail(email, token) {
    const verificationLink = `http://89.116.74.98/verify/${token}`; // Update with your actual domain and endpoint
    const mailOptions = {
        from: 'twinklex2025@gmail.com',
        to: email,
        subject: 'Email Verification',
        text: `Click the following link to verify your email: ${verificationLink}`,
    };

    console.log(mailOptions, 'mailOptions');
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Email verification error:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

exports.verifyEmail = async (req, res) => {
    try {
        const token = req.params.token;

        console.log(token, 'token')
        // Find the user with the matching verification token
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(404).json({ error: 'Invalid verification token.' });
        }

        // Mark the user as verified and clear the verification token
        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        // You can redirect the user to a success page or send a response
        return res.status(200).json({ message: 'Email verification successful. You can now log in.' });
    } catch (error) {
        console.error('Verification error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.membership_save = function (req, res) {
    if (req.body.membership > 1) {
        var split_cardnum = req.body.cardnumber.split(' ');
        var cardnumber = '';
        for (var i = 0; i < split_cardnum.length; i++) {
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
                          console.log(err.message);
                          res.redirect('/error');
                      } else {
                          console.log(response);
                            if(response.success === true)
                            {
                                if (req.body.membership == 1) {
                                    var ask = 0;
                                }
                                if (req.body.membership == 2 || req.body.membership == 3) {
                                    var ask = 1;
                                }
                                if (req.body.membership == 4) {
                                    var ask = 2;
                                }
                                var today = new Date();
                                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds() + '.' + today.getMilliseconds();
                                User.findByIdAndUpdate(req.body.user_id, {
                                    $set: {
                                        membership: req.body.membership,
                                        left_membership: req.body.membership,
                                        ask: ask,
                                        created_at: date,
                                        card_number: req.body.cardnumber,
                                        expire_month: req.body.month,
                                        expire_year: req.body.year,
                                        cvc: req.body.cvc,
                                        started_at: date,
                                        state: 1
                                    }
                                }, (err, user) => {
                                    if (err) {
                                        console.log(err);
                                        res.redirect('/error');
                                    } else {
                                        

                                        // res.json({ msg: 'success' });
                                        var mailOptions = {
                                            from: `${master_email}`,
                                            to: user.email,
                                            subject: 'Support',
                                            text: 'Welcome to app.social-media-builder.com'
                                        };
                                        
                                        transporter.sendMail(mailOptions, function(error, info){
                                            if (error) {
                                                console.log(error);
                                                res.redirect('/error');
                                            } else {
                                                console.log('Email sent: ' + info.response);
                                                var token = jwt.sign({ id: user._id }, 'MVP', {
                                                    expiresIn: 86400 // expires in 24 hours
                                                });
                                                req.session.userid = user._id;
                                                req.session.name = user.name;
                                                req.session.surname = user.surname;
                                                req.session.phone = user.phone;
                                                req.session.email = user.email;
                                                req.session.permission = user.permission;
                                                req.session.membership = user.membership;
                                                req.session.created_at = user.created_at;
                                                req.session.started_at = user.started_at;
                                                req.session.state = user.state;
                                                req.session.photo = user.photo;
                                                req.session.introduction = user.introduction;
                                                req.session.left_membership = req.body.membership;
                                                req.session.industry = user.industry;
                                                req.session.card_number = user.card_number;
                                                req.session.expire_month = user.expire_month;
                                                req.session.expore_year = user.expire_year;
                                                req.session.cvc = user.cvc;
                                                req.session.token = token;
                                                req.session.share_cnt = user.shared_cnt;
                                                req.session.ask = user.ask;
                                                req.session.language = user.language;
                                                res.redirect('/');
                                            }
                                        });
                                    }
                                });
                            } else {
                                var error_msg = response.message;
                                console.log(error_msg+'**********')
                                res.json({msg : 'failed', error_msg : error_msg});
                            }
                          
                      }
                  });
            } else {
              console.error(result.message);
              res.redirect('/error');
            }
        });
    }else {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds() + '.' + today.getMilliseconds();
        User.findByIdAndUpdate(req.body.user_id, {
            $set: {
                membership: req.body.membership,
                left_membership: req.body.membership,
                ask: 1,
                created_at: date,
                card_number: req.body.cardnumber,
                expire_month: req.body.month,
                expire_year: req.body.year,
                cvc: req.body.cvc,
                started_at: date,
                state: 1
            }
        }, (err, user) => {
            if (err) {
                console.log(err);
                res.redirect('/error');
            } else {
                
                // res.json({ msg: 'success' });
                console.log(user.email);
                var mailOptions = {
                    from: `${master_email}`,
                    to: user.email,
                    subject: 'User register',
                    text: 'Welcome to app.social-media-builder.com'
                };
                
                // transporter.sendMail(mailOptions, function(error, info){
                //     if (error) {
                //         console.log(error);
                //         res.redirect('/error');
                //     } else {
                        // console.log('Email sent: ' + info.response);
                        var token = jwt.sign({ id: user._id }, 'cmssecret', {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        req.session.userid = user._id;
                        req.session.name = user.name;
                        req.session.surname = user.surname;
                        req.session.phone = user.phone;
                        req.session.email = user.email;
                        req.session.permission = user.permission;
                        req.session.membership = user.membership;
                        req.session.created_at = user.created_at;
                        req.session.started_at = user.started_at;
                        req.session.state = user.state;
                        req.session.photo = user.photo;
                        req.session.introduction = user.introduction;
                        req.session.left_membership = 1;
                        req.session.industry = user.industry;
                        req.session.card_number = user.card_number;
                        req.session.expire_month = user.expire_month;
                        req.session.expore_year = user.expire_year;
                        req.session.cvc = user.cvc;
                        req.session.token = token;
                        req.session.share_cnt = user.shared_cnt;
                        req.session.ask = user.ask;
                        req.session.language = user.language;
                        console.log(req.session.token);
                        res.redirect('/');
                //     }
                // });
            }
        });
    }
    
}

exports.signin = function (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    console.log(email, password);

    if (email.length === 0) {
        // Handle email validation error
        res.status(400).json({ success: false, message: 'Email is required.' });
    } else {
        User.findOne({ email: email }, (err, user) => {
            if (err) {
                console.log(err);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            } else {
                if (!user) {
                    // Handle user not found error
                    res.status(401).json({ success: false, message: 'Invalid email.' });
                } else {
                    if(!user.isVerified) {
                        res.status(401).json({ success: false, message: 'Email is not verified. Please check your email for the verification link.' });
                    } else {
                        if (password.length === 0) {
                            // Handle password validation error
                            res.status(400).json({ success: false, message: 'Password is required.' });
                        } else {
                            const passwordIsValid = bcrypt.compareSync(password, user.password);
                            if (!passwordIsValid) {
                                // Handle invalid password error
                                res.status(401).json({ success: false, message: 'Invalid password.' });
                            } else {
                                // Generate a token
                                const token = jwt.sign({ userId: user._id, email: email, name: user?.name }, 'your-secret-key', { expiresIn: '1h' });
    
                                // Send the token to the client (Next.js)
                                res.status(200).json({ success: true, token });
                            }
                        }
                    }
                }
            }
        });
    }
};

exports.profile = function (req, res, next) {
    console.log(req.session);
    Post.find({}, (err, posts) => {
        if (err) {
            console.log(err);
            res.redirect('/error');
        } else {
            var post_cnt = posts.length;
            res.render('pages/user/profile', { title: 'CMS | Profile', session: req.session, post_cnt: post_cnt, shared_cnt: req.session.shared_cnt, recent_url : req.url });
        }
    })

}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        // Uploads is the Upload_folder_name
        cb(null, root_dir+"public/uploads/users")
    },
    filename: function (req, file, cb) {
        cb(null, req.session.userid + ".png")
    }
})

// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional
const maxSize = 10 * 1000 * 1000;

var upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb) {

        // Set the filetypes, it is optional
        var filetypes = /jpeg|jpg|png/;
        var mimetype = filetypes.test(file.mimetype);

        var extname = filetypes.test(path.extname(
            file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb("Error: File upload only supports the "
            + "following filetypes - " + filetypes);
    }

    // mypic is the name of file attribute
}).single("photo");

exports.profile_save = function (req, res) {
    console.log(req.body)
    upload(req, res, function (err) {

        if (err) {

            // ERROR occured (here it can be occured due
            // to uploading image of size greater than
            // 1MB or uploading different file type)
            res.redirect('/error');
        }
        else {
            req.session.photo = req.session.userid + '.png';
            req.session.introduction = req.body.introduction;
            // SUCCESS, image successfully uploaded
            User.findByIdAndUpdate(req.session.userid, {
                $set: {
                    introduction: req.body.introduction,
                    photo: req.session.userid + '.png'
                }
            }, (err) => {
                if (err) {
                    console.log(err);
                    res.redirect('/error');
                } else {
                    res.redirect('/auth/profile');
                }
            });

        }
    });

}


exports.photo_generate = function (req, res, next) {
    res.render('pages/user/photo_generate', { layout : false, title : 'CMS | Logo Generate', recent_url : req.url, session : req.session});
}



exports.logout = function (req, res, next) {
    req.session.destroy((err) => {
        console.log(err)
    });
    res.redirect('/');
}