var User = require('../models/User');
var Category = require('../models/Category');
var Industry = require('../models/Industry');
var Post = require('../models/Post');
const Training = require('../models/Training');
var formidable = require('formidable');
var fs = require('fs');
const Faq = require('../models/Faq');
const root_dir = '/CMS_with_node/';

exports.index = function(req, res, next) {
    User.find({}, (err, users) => {
        if(err) {
            console.log(err);
            res.redirect('/error');
        } else {
            Category.find({}, (err, categories) => {
                if(err) {
                    console.log(err);
                    res.redirect('/error');
                } else {
                    Industry.find({}, (err, industries) => {
                        if(err) {
                            console.log(err);
                            res.redirect('/error');
                        } else {
                            Post.find({}, (err, posts) => {
                                if(err) {
                                    console.log(err)
                                    res.redirect('/error');
                                } else {
                                    res.render('pages/admin/home', {title : 'CMS | Admin', session : req.session, users : users, categories : categories, industries : industries, posts : posts, recent_url : req.url});
                                }
                            });                            
                        }
                    });    
                }
            });
        }
    });
}

exports.change_state = function(req, res) {
    User.findByIdAndUpdate(req.body.user_id, {$set : {
        state : req.body.state
    }}, (err, user) => {
        if(err) {
            console.log(err)
            res.redirect('/error');
        } else {
            res.json({ msg : 'success'});
        }
    });
}

exports.change_permission = function(req, res) {
    User.findByIdAndUpdate(req.body.user_id, {$set : {
        permission : req.body.permission
    }}, (err, user) => {
        if(err) {
            console.log(err)
            res.redirect('/error');
        } else {
            res.json({ msg : 'success'});
        }
    });
}

exports.user_close = function(req, res) {
    User.findByIdAndUpdate(req.body.user_id, {$set : {
        state : 3
    }}, (err, user) => {
        if(err) {
            console.log(err)
            res.redirect('/error');
        } else {
            res.json({ msg : 'success'});
        }
    });
}

exports.user_unclose = function(req, res) {
    User.findByIdAndUpdate(req.body.user_id, {$set : {
        state : 1
    }}, (err, user) => {
        if(err) {
            console.log(err)
            res.redirect('/error');
        } else {
            res.json({ msg : 'success'});
        }
    });
}

exports.user_delete = function(req, res) {
    User.findByIdAndDelete(req.body.user_id, (err) => {
        if(err) {
            console.log(err);
            res.redirect('/error');
        } else {
            res.json({ msg : 'success'});
        }
    })
}

exports.category_save = function(req, res) {
    var category_name = req.body.category;
    var cat_id = req.body.cat_id;
    console.log(req.body)
    var category;
    if(cat_id == '') {
        Category.create({
            language : req.body.language,
            name : category_name
        }, (err, category)=> {
            if(err) {
                console.log(err);
                res.redirect('/error');
            } else {
                res.json({msg: 'save', category: category});
            }
        })
    } else {
        Category.findByIdAndUpdate(cat_id, {$set : {
            name : category_name
        }}, (err) => {
            if(err) {
                console.log(err);
                res.redirect('/error');
            } else {
                category = {
                    _id : cat_id,
                    name : category_name,
                    language : req.body.language
                }
                res.json({msg:'update', category : category})
            }
        })
    }
}

exports.category_delete = function(req, res) {
    var cat_id = req.body.cat_id;
    console.log(cat_id)
    var category;
    Category.findByIdAndDelete(cat_id, (err) => {
        if(err) {
            console.log(err);
            res.redirect('/error');
        } else {
            category = {
                _id : cat_id
            }
            res.json({category : category});
        }
    })
}

exports.industry_save = function(req, res) {
    var industry_name = req.body.industry;
    var industry_id = req.body.industry_id;
    console.log(req.body)
    var industry;
    if(industry_id == '') {
        Industry.create({
            name : industry_name
        }, (err, industry)=> {
            if(err) {
                console.log(err);
                res.redirect('/error');
            } else {
                res.json({msg: 'save', industry: industry});
            }
        })
    } else {
        Industry.findByIdAndUpdate(industry_id, {$set : {
            name : industry_name
        }}, (err) => {
            if(err) {
                console.log(err);
                res.redirect('/error');
            } else {
                industry = {
                    _id : industry_id,
                    name : industry_name
                }
                res.json({msg:'update', industry : industry})
            }
        })
    }
}

exports.industry_delete = function(req, res) {
    var industry_id = req.body.industry_id;
    console.log(industry_id)
    var industry;
    Industry.findByIdAndDelete(industry_id, (err) => {
        if(err) {
            console.log(err);
            res.redirect('/error');
        } else {
            industry = {
                _id : industry_id
            }
            res.json({industry : industry});
        }
    })
}

exports.post_delete = function(req, res) {
    Post.findByIdAndDelete(req.body.post_id, (err) => {
        if(err) {
            console.log(err);
            res.redirect('/error');
        } else {
            res.json({ msg : 'success'});
        }
    })
}

exports.training_save = function(req, res) {
    if(req.body.type === 'info')
    {
        Training.findOne({type : 'info'}, (err, training) => {
            if(err) {
                console.log(err);
                res.redirect('/error');
            } else {
                if(training) {
                    Training.findOneAndUpdate({type : 'info'}, {$set : {
                        language : req.body.video_lang,
                        title : req.body.title,
                        type : req.body.type,
                        page_type : req.body.page_type,
                        description : req.body.description,
                        url : req.body.url
                    }}, (err, training) => {
                        if(err) {
                            console.log(err);
                            res.redirect('/error');
                        } else {
                            res.json({video : training});
                        }
                    })
                } else {
                    Training.create({
                        language : req.body.video_lang,
                        title : req.body.title,
                        type : req.body.type,
                        page_type : req.body.page_type,
                        description : req.body.description,
                        url : req.body.url
                    }, (err, training) => {
                        if(err) {
                            console.log(err);
                            res.redirect('/error');
                        } else {
                            res.json({video : training});
                        }
                    })
                }
            }
        })
        
    } else {
        Training.create({
            language : req.body.video_lang,
            title : req.body.title,
            type : req.body.type,
            page_type : req.body.page_type,
            description : req.body.description,
            url : req.body.url
        }, (err, training) => {
            if(err) {
                console.log(err);
                res.redirect('/error');
            } else {
                res.json({video : training});
            }
        })
    }
    
}

exports.videos = function(req, res) {
    Training.find({}, (err, trainings) => {
        if(err) {
            console.log(err);
            res.redirect('/error');
        } else {
            res.render('pages/admin/video', {title : 'CMS | Video Management', session : req.session, trainings : trainings, recent_url : req.url});
        }
    });    
}

exports.trainingupload = function(req, res) {
    var form = new formidable.IncomingForm();
    console.log(req);
    form.parse(req);
    var video_name = 'video_'+req.session.userid+'_'+new Date().getFullYear()+new Date().getMonth()+new Date().getDate() + new Date().getHours()+new Date().getMinutes() + new Date().getSeconds() + new Date().getMilliseconds() +".mp4";

    form.on('fileBegin', function (name, file){
        console.log(name)
        file.path = root_dir+'public/videos/trainings/' + video_name;
    });

    form.on('file', function (name, file){
        console.log('Uploaded ' + video_name);
    });

    res.json({msg:'success', video_name : video_name});
}

exports.infoupload = function(req, res) {
    var form = new formidable.IncomingForm();
    console.log(req);
    form.parse(req);

    form.on('fileBegin', function (name, file){
        console.log(name)
        file.path = 'public/videos/info.mp4';
    });

    form.on('file', function (name, file){
        console.log('Uploaded ' + 'info.mp4');
    });

    res.json({msg:'success', video_name : 'info.mp4'});
}

exports.video_delete = function(req, res) {
    Training.findByIdAndDelete(req.body.video_id, (err, video) => {
        if(err) {
            console.log(err);
            res.redirect('/error');
        } else {
            var urls = video.url.split('/');
            console.log(urls[3]);
            if(urls[3] == 'info.mp4')
            {
                fs.unlinkSync(root_dir+'public/videos/'+ urls[3], (err) =>{
                    if(err) {
                        res.redirect('/error');
                    } else {
                        res.json({msg : 'delete'});
                    }
                });
            } else {
                fs.unlinkSync(root_dir+'public/videos/trainings/'+ urls[3],  (err) =>{
                    if(err) {
                        res.redirect('/error');
                    } else {
                        res.json({msg : 'delete'});
                    }
                });
            }
        }
    });
}

exports.faq = function(req, res) {
    Faq.find({}, (err, faqs) => {
        if(err) {
            console.log(err);
            res.redirect('/error');
        } else {
            Category.find({
                language : 'EN'
            }, (err, categories) => {
                if(err) {
                    console.log(err);
                    res.redirect('/error');
                } else {
                    res.render('pages/admin/faq', {title : 'CMS | FAQ', session : req.session, categories : categories, faqs : faqs, recent_url : req.url});                   
                }
            })
        }
    })
}

exports.change_language = function(req, res) {
    Category.find({
        language : req.body.language
    }, (err, categories) => {
        if(err) {
            console.log(err);
            res.redirect('/error');
        } else {
            res.json({categories : categories});
        }
    })
}

exports.faq_save = function(req, res) {
    Faq.create({
        language : req.body.language,
        category : req.body.category,
        email : req.session.email,
        title : req.body.title,
        content : req.body.content
    }, (err, faq) => {
        if(err) {
            console.log(err);
            res.redirect('/error');
        } else {
            res.json({faq : faq});
        }
    })
}

exports.faq_update = function(req, res) {
    Faq.findByIdAndUpdate(req.body.faq_id, {$set : {
        language : req.body.language,
        category : req.body.category,
        title : req.body.title,
        content : req.body.content
    }}, (err, faq) => {
        if(err) {
            res.redirect('/error');
        } else{
            res.json({faq : faq});
        }
    })
}

exports.faq_delete = function(req, res) {
    Faq.findByIdAndDelete(req.body.faq_id, (err) => {
        if(err) {
            console.log(err);
            res.redirect('/error');
        } else {
            res.json({msg : 'success'});
        }
    })
}