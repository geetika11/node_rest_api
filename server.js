var express = require('express')
var User = require('./models/user')
var Article = require('./models/article')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var randomstring=require('randomstring')
var bodyParser = require('body-parser')
var CommentonArticle=require('./models/comment')
var jwt = require('jsonwebtoken');
var config = require('./config');

var app = express()
app.set('port', 8000)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));


// creating the cookie for authentication
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});

//creating the session
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.status(201);
    } else {
        next();
    }
};


//api for the signup 
app.route('/signup')
    .post(sessionChecker,(req, res) => {
        User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })   
            .then(user => {
                req.session.user = user.dataValues;
                res.status(201).json(user)
                
            })
            .catch(error => {
                res.status(401);
            })
    });


//api to get and post the article
app.route('/article')
    .get(sessionChecker, (req, res) => {
        Article.findAll().then(function (art) {
            res.status(200).json(art)
        });
    })
    .post((req, res) => {
        
        Article.create({
            title: req.body.title,
            description: req.body.description,
            body: req.body.body,
            slug:randomstring.generate({
                length:10,
                charset:'alphanumeric'
            })
        })
            .then(article => {
                res.status(201).json(article)              
            })
            .catch(error => {
               res.status(403)
            });
    });

//api to delete the particular article
app.delete('/article/:slug',(req,res)=>{
    const slug1 = req.params.slug
    const sqlite3 = require('sqlite3');
    let db = new sqlite3.Database('./models/article.db');
    db.run(`delete from articles where slug=?`,[slug1])
});  

//api to get and update the particluar article   
app.route('/article/:slug')
    .get(sessionChecker, (req, res) => {
        const slug = req.params.slug
        Article.findOne({ where: { slug: slug } }).then(function (artone) {
            if (!artone) {
                res.status(404).json('message:This article do not exist');
            } else {
                res.status(201).json(artone)
                console.log('my articles' + artone)
            }
        });

    })
    // update the particular article
    .put(sessionChecker, (req, res) => {
        const slug = req.params.slug  
        const sqlite3 = require('sqlite3');
        var newtitle = req.body.title;
        let db = new sqlite3.Database('./models/article.db');
        db.run(`update articles set title=? where slug=?`,[newtitle,slug])
    });

    //api to post the comment on the particular article
    app.route('/article/:slug/comment')
    .post(sessionChecker, (req, res) =>
     {
        const slug = req.params.slug
        Article.findOne({ where: { slug: slug } }).then(function (artone) 
        {
            CommentonArticle.create({
                body: req.body.body
            })
            .then(commenton => {
                    res.status(201).json(commenton)              
                })
                .catch(error => {
                   res.status(403)                
            })
            })
    })
     //to get all the comments on the particular article
         .get(sessionChecker, (req, res) => {
        CommentonArticle.findAll().then(function (art) {
            res.status(200).json(art)
            console.log('my comments' + art)
        });
    })

//api to delete the particular comment
app.delete('/article/:slug/comment/:cid',(req,res)=>{
    const cid1 = parseInt(req.params.cid)
    const sqlite3 = require('sqlite3');
    let db = new sqlite3.Database('./models/test.db');
    db.run(`delete from comments where id=?`,[cid1])
} )


 


// route for user Login
app.route('/login')
    .post((req, res) => {
        var username = req.body.username;
        var password = req.body.password;        
        User.findOne({ where: [{ username: username, password: password }] }).then(function (user) {
            if (!user) {
                res.status(404)
            } else {
                res.status(201).json(user)
            }
        });
    });


// route for user logout
app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
       res.status(200)
    } else {
       res.status(400)
    }
});


// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
});
// start the express server
app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));
