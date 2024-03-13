var formidable = require('formidable');
var Jimp = require('jimp');
const Post = require('../models/Post');
const User = require('../models/User');
const http = require('http');
const fs = require('fs');
const zipdir = require('zip-dir');
const { clipboard } = require('electron');
const { response } = require('express');

const root_dir = '/CMS_with_node/';
exports.logo_upload = function(req, res) {
    var form = new formidable.IncomingForm();
    // console.log(req);
    form.parse(req);
    var image_name = 'logo_'+req.session.userid+'_'+new Date().getFullYear()+new Date().getMonth()+new Date().getDate() + new Date().getHours()+new Date().getMinutes() + new Date().getSeconds() + new Date().getMilliseconds() +".png";

    form.on('fileBegin', function (name, file){
        console.log(name)
        file.path = root_dir+'public/uploads/logos/' + image_name;
    });

    form.on('file', function (name, file){
        console.log('Uploaded ' + image_name);
    });

    res.json({msg:'success', image_name : image_name});
}

exports.image_jimp = function(req, res) {
    console.log(req.query)
    Jimp.read(`${root_dir}public/uploads/posts/${req.query.image}`, (err, img) => {
        if(err) {
            console.log(err);
            res.redirect('/error');
        } else {
            Jimp.read(`${root_dir}public/uploads/logos/${req.query.logo}`, (err, logo) => {
                if(err) {
                    console.log(err);
                    res.redirect('/error');
                } else {
                    var logo_w = logo.bitmap.width;
                    var logo_h = logo.bitmap.height;
                    var img_w = img.bitmap.width;
                    var img_h = img.bitmap.height;

                    logo.resize(150, 150*(logo_h/logo_w));
                    img.resize(600, 600*(img_h/img_w));
                    var new_img_h = img.bitmap.height;
                    var new_logo_h = logo.bitmap.height;
                    var logo_position = req.query.logo_position;

                    if(logo_position === 'bl')
                    {
                        img.blit(logo, 0, (new_img_h - new_logo_h));
                    }
                    if(logo_position === 'tl')
                    {
                        img.blit(logo, 0, 0);
                    }
                    if(logo_position === 'br')
                    {
                        img.blit(logo, 450, (new_img_h - new_logo_h));
                    }
                    if(logo_position === 'tr')
                    {
                        img.blit(logo, 450, 0);
                    }
                    
                    var current_time = new Date().getFullYear()+''+new Date().getMonth()+''+new Date().getDate()+''+new Date().getHours()+''+new Date().getMinutes()+''+new Date().getSeconds()+''+new Date().getMilliseconds();
                    var share_img = 'share_'+req.session.userid+'_'+current_time+'.png';
                    img.write(root_dir+'public/uploads/shares/images/'+share_img, (err)=> {
                        if(err) {
                            res.redirect('/error');
                        } else {
                            res.json({ msg : 'success', share_img : share_img});
                        }
                    });
                }
            })
        }
    });
}

exports.image_jimp_position_change = function(req, res) {
    console.log(req.query)
    Jimp.read(`${root_dir}public/uploads/posts/${req.query.image}`, (err, img) => {
        if(err) {
            console.log(err);
            res.redirect('/error');
        } else {
            Jimp.read(`${root_dir}public/uploads/logos/${req.query.logo}`, (err, logo) => {
                if(err) {
                    console.log(err);
                    res.redirect('/error');
                } else {
                    var logo_w = logo.bitmap.width;
                    var logo_h = logo.bitmap.height;
                    var img_w = img.bitmap.width;
                    var img_h = img.bitmap.height;

                    logo.resize(150, 150*(logo_h/logo_w));
                    img.resize(600, 600*(img_h/img_w));
                    var new_img_h = img.bitmap.height;
                    var new_logo_h = logo.bitmap.height;
                    var logo_position = req.query.logo_position;
                    if(logo_position === 'bl')
                    {
                        img.blit(logo, 0, (new_img_h - new_logo_h));
                    }
                    if(logo_position === 'tl')
                    {
                        img.blit(logo, 0, 0);
                    }
                    if(logo_position === 'br')
                    {
                        img.blit(logo, 450, (new_img_h - new_logo_h));
                    }
                    if(logo_position === 'tr')
                    {
                        img.blit(logo, 450, 0);
                    }
                    
                    var current_time = new Date().getFullYear()+''+new Date().getMonth()+''+new Date().getDate()+''+new Date().getHours()+''+new Date().getMinutes()+''+new Date().getSeconds()+''+new Date().getMilliseconds();
                    var share_img = 'share_'+req.session.userid+'_'+current_time+'.png';
                    img.write(root_dir+'public/uploads/shares/images/'+share_img, (err) => {
                        if(err ) {
                            res.redirect('/error');
                        } else {
                            res.json({ msg : 'success', share_img : share_img});
                        }
                    });
                }
            })
        }
    });
}

exports.share = function(req, res) {
    var text_url = root_dir + 'public/uploads/shares/txt/'+req.query.title+'.txt';
    var image_url = root_dir + 'public/' + req.query.image_url;

    fs.writeFile(text_url, req.query.content, function (err) {
        if (err) {
            console.log(err+'.......................................');
            res.redirect('/error');
        } else {
            User.findById(req.session.userid, (err, user) => {
                if(err) {
                    console.log(err);
                    res.redirect('/error');
                } else {
                    if(user.email == 'codedarkhorse@gmail.com')
                    {
                        Post.findById(req.query.post_id, (err, post) => {
                            if(err) {
                                console.log(err);
                                res.redirect('/error');
                            } else {
                                Post.findByIdAndUpdate(req.query.post_id, { $set : {
                                    shared : post.shared + 1
                                }}, (err) => {
                                    if(err) {
                                        console.log(err);
                                        res.redirect('/error');
                                    } else {
                                        fs.mkdir(`${root_dir}public/uploads/shares/download/${req.query.title}`, { recursive: true }, function(err) {
                                            if (err) {
                                              console.log(err)
                                            } else {
                                                console.log("New directory successfully created.");
                                                fs.copyFile(`${text_url}`, `${root_dir}public/uploads/shares/download/${req.query.title}/${req.query.title}.txt`, (err) => {
                                                    if (err) {
                                                        console.log(err);
                                                        res.redirect('/error');
                                                    } else {
                                                        fs.copyFile(`${image_url}`, `${root_dir}public/uploads/shares/download/${req.query.title}/${req.query.title}.png`, (err) => {
                                                            if (err) {
                                                                console.log(err);
                                                                res.redirect('/error');
                                                            } else {

                                                                var zip_url = `${root_dir}public/uploads/shares/download/${req.query.title}.zip`;

                                                                zipdir(`${root_dir}public/uploads/shares/download/${req.query.title}`, { saveTo: zip_url}, function (err, buffer) {
                                                                    // `buffer` is the buffer of the zipped file
                                                                    // And the buffer was saved to `~/myzip.zip`
                                                                        res.json({msg : 'success', left_membership : req.session.left_membership, shared : post.shared+1, zip_url : `uploads/shares/download/${req.query.title}.zip`}); 
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        User.findByIdAndUpdate(req.session.userid, {$set: {
                            left_membership : user.left_membership - 1,
                            shared_cnt : user.shared_cnt + 1
                        }}, (err) => {
                            if(err) {
                                console.log(err);
                                res.redirect('/error');
                            } else {
                                req.session.shared_cnt = user.shared_cnt + 1;
                                Post.findById(req.query.post_id, (err, post) => {
                                    if(err) {
                                        console.log(err);
                                        res.redirect('/error');
                                    } else {
                                        Post.findByIdAndUpdate(req.query.post_id, { $set : {
                                            shared : post.shared + 1
                                        }}, (err) => {
                                            if(err) {
                                                console.log(err);
                                                res.redirect('/error');
                                            } else {
                                                req.session.left_membership = user.left_membership - 1;
                                                fs.mkdir(`${root_dir}public/uploads/shares/download/${req.query.title}`, { recursive: true }, function(err) {
                                                    if (err) {
                                                      console.log(err)
                                                    } else {
                                                        console.log("New directory successfully created.");
                                                        fs.copyFile(`${text_url}`, `${root_dir}public/uploads/shares/download/${req.query.title}/${req.query.title}.txt`, (err) => {
                                                            if (err) {
                                                                console.log(err);
                                                                res.redirect('/error');
                                                            } else {
                                                                fs.copyFile(`${image_url}`, `${root_dir}public/uploads/shares/download/${req.query.title}/${req.query.title}.png`, (err) => {
                                                                    if (err) {
                                                                        console.log(err);
                                                                        res.redirect('/error');
                                                                    } else {
    
                                                                        var zip_url = `${root_dir}public/uploads/shares/download/${req.query.title}.zip`;
    
                                                                        zipdir(`${root_dir}public/uploads/shares/download/${req.query.title}`, { saveTo: zip_url}, function (err, buffer) {
                                                                            // `buffer` is the buffer of the zipped file
                                                                            // And the buffer was saved to `~/myzip.zip`
                                                                                res.json({msg : 'success', left_membership : req.session.left_membership, shared : post.shared+1, zip_url : `uploads/shares/download/${req.query.title}.zip`}); 
                                                                        });                       
                                                                            
                                                                        
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                    
                }
            });
        }
    });
    
}
