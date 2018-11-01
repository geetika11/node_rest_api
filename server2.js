//token based authentication file..
var Profile = require('./models/profile')
var express = require('express')
var User = require('./models/user')
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken');
var config = require('./config');
var Article = require('./models/article')
var jwt1 = require('jwt-simple')
var randomstring = require('randomstring')
var Tag=require('./models/tags')
const sqlite3 = require('sqlite3');
var CommentonArticle = require('./models/comment')
var app = express()
app.set('port', 8080)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//api for the signup using jwt token fully done acc to api
app.route('/users')
    .post((req, res) => {

        User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        }),
            Profile.create({
                username: req.body.username,
                email: req.body.email,
                //password: req.body.password,
                newpassword: '',
                image: '',
                bio: ''
            }).then(user => {
                if (user) {
                    const playload = {
                        sub: user.id,
                        expiresIn: 86400
                    };
                    var token = jwt1.encode(playload, config.secret, process.env.TOKEN_SECRET);
                    var reguser = { email: req.body.email, token: token, username: req.body.username, bio: '', image: '' }
                    res.status(201).json({ user: reguser })
                }
                else {
                    res.status(400).json({ message: 'User can\'tt be created' })
                }

            })
                .catch((error) => res.status(400).json({ message: 'username or email already exists' }))
    });

//api to login the user fully done acc to api
app.route('/users/login')
    .post((req, res) => {
        var email = req.body.email;
        var password = req.body.password;
        User.findOne({ where: [{ email: email, password: password }] }).then(function (user) {
            if (!user) {
                res.status(404).json({ message: 'The requested User does not exist' })
            } else {
                Profile.findOne({ where: [{ email: email }] })
                    .then
                    (function (profile) {
                        const playload = {
                            sub: user.id
                        };
                        var token = jwt1.encode(playload, config.secret, process.env.TOKEN_SECRET);
                        var authuser = { email: req.body.email, token: token, username: user.username, bio: profile.bio, image: profile.image }
                        res.status(201).json({ user: authuser })
                    })
            }

        })
            .catch((error) => res.status(400).json({ message: 'Request could not be fullfilled,Please try again:(  ' }))
    });



//api to get the current user fully done acc to api
app.route('/user')
    .get((req, res) => {
        var token = req.headers['token'];
        if (!token) { return res.status(401).send({ auth: false, message: 'No token provided.' }); }
        const payload = jwt1.decode(token, config.secret, process.env.TOKEN_SECRET);
        var id = JSON.stringify(payload.sub)
        console.log('value of id ' + id)

        User.findOne({ where: [{ id: id }] }).then(function (user) {
            if (!user) {
                res.status(404).json({ message: 'The requested User does not exist' })
            } else {
                Profile.findOne({ where: [{ email: user.email }] })
                    .then
                    (function (profile) {
                        var authuser = { email: profile.email, token: token, username: user.username, bio: profile.bio, image: profile.image }
                        res.status(201).json({ user: authuser })
                    })
            }
        })
            .catch((error) => res.status(400).json({ message: 'Request could not be fullfilled,Please try again:(  ' }))
    })

    //update the current user fully done acc to api
    .put((req, res) => {
        var email = req.body.email
        var username = req.body.username
        var password = req.body.password
        var image = req.body.image
        var bio = req.body.bio
        var token = req.headers['token'];
        var token1 = token
        if (!token) { return res.status(401).send({ auth: false, message: 'No token provided.' }); }
        const payload = jwt1.decode(token, config.secret, process.env.TOKEN_SECRET);
        var id = JSON.stringify(payload.sub)
        User.findOne({ where: [{ id: id }] }).then(function (user) {
            if (!user) {
                res.status(404).json({ message: 'The requested User does not exist' })
            } else {
                console.log('value of user token' + user.token)
                Profile.findOne({ where: [{ email: user.email }] })
                    .then
                    (function (profile) {
                        let db = new sqlite3.Database('./models/test2.db');
                        db.run(`update users set username=?,email=?,password=? where id=?`, [username, email, password, id])
                        db.run(`update profiles set username=?,email=?,newpassword=?,bio=?,image=? where username=?`, [username, email, password, bio, image, profile.username])
                        var updateuser = { email: profile.email, token: token1, username: profile.username, bio: profile.bio, image: profile.image }
                        res.status(201).json({ user: updateuser })
                    })
            }
        })
            .catch((error) => res.status(400).json({ message: 'Request could not be fullfilled,Please try again:(  ' }))

    });


//api to get and post the article and get article are not acc to the requiremnt
//app.route('/articles')
// .get((req, res) => {
//     let whereClause = []
//     for (let key of Object.keys(req.query)) {
//         switch (key) {
//             case 'author':
//                 author1 = req.query.author
//                 console.log(author1);
//                 Article.findAll({ where: { author: author1 } }).then(function (artauth) {
//                     if (!artauth) {
//                         res.status(404).json('message:This article do not exist');
//                     } else {
//                         Profile.findOne({ where: [{ username: author1 }] })
//                             .then(async function (profile) {
//                                 // var bio1 = profile.bio
//                                 // var image1 = profile.image

//                                 // var profile1 = { username: author1, bio: bio1, image: image1, following: 'false' }
//                                 // var newabc = { article: { artauth, profile1 } }
//                                 // console.log('value of bewabc ' + JSON.stringify(newabc))
//                                 //  res.status(201).json(artone)
//                                 //  console.log('my articles' + artone)
//                                 // var currentarticle = { article: newarticle, author: profile1 } 
//                                 res.status(201).json(abc)


//                             })
//                     }

//                 })
//                 break;
//             case 'offset':
//                 console.log("offset");
//                 break;
//         }

//         // Article.findAll().then(function (pro) {           
//         //             res.status(200).json(pro)
//         //         }) 
//     }
// })

//api to post the article fully done acc to api
app.route('/articles')
    .post((req, res) => {
        var token = req.headers['token'];
        if (!token) { return res.status(401).send({ auth: false, message: 'No token provided.' }); }
        const payload = jwt1.decode(token, config.secret, process.env.TOKEN_SECRET);
        var id = JSON.stringify(payload.sub)
        console.log('value of id ' + id)
        var slug = randomstring.generate({
            length: 10,
            charset: 'alphanumeric'
        })
        User.findOne({ where: [{ id: id }] }).then(function (user) {
            if (!user) {
                res.status(404).json({ message: 'The requested User does not exist' })
            } else {
                Profile.findOne({ where: [{ email: user.email }] })
                    .then(function (profile) {
                        Article.create({
                            title: req.body.title,
                            description: req.body.description,
                            body: req.body.body,
                            slug: slug,
                            author: profile.username,
                        })
                            .then(function (article) {
                                var pro = { username: profile.username, bio: profile.bio, image: profile.image, following: 'false' }
                                var artic = { slug: article.slug, title: article.title, description: article.description, body: article.body, createdAt: article.createdAt, updatedAt: article.updatedAt, author: pro }
                                res.status(201).json({ article: artic })

                            })
                    })
            }
        })
    })


//api to get and update the particluar article   fully done acc to api
app.route('/articles/:slug')
    .get((req, res) => {
        const slug = req.params.slug
        Article.findOne({ where: { slug: slug } }).then(function (article) {
            if (!article) {
                res.status(404).json('message:This article do not exist');
            } else {
                var username = article.author
                Profile.findOne({ where: [{ username: username }] })
                    .then(function (profile) {
                        var pro = { username: profile.username, bio: profile.bio, image: profile.image, following: 'false' }
                        var artic = { slug: article.slug, title: article.title, description: article.description, body: article.body, createdAt: article.createdAt, updatedAt: article.updatedAt, author: pro }
                        res.status(201).json({ article: artic })

                    })
            }
        });

    })
    // update the particular article fully done acc to api
    .put((req, res) => {
        var token = req.headers['token'];
        if (!token) { return res.status(401).send({ auth: false, message: 'No token provided.' }); }
        const payload = jwt1.decode(token, config.secret, process.env.TOKEN_SECRET);
        var id = JSON.stringify(payload.sub)
        console.log('value of id ' + id)
        User.findOne({ where: [{ id: id }] }).then(function (user) {
            if (!user) {
                res.status(404).json({ message: 'The requested User does not exist' })
            } else {
                Profile.findOne({ where: [{ email: user.email }] })
                    .then
                    (function (profile) {
                        const slug = req.params.slug
                        var newtitle = req.body.title;
                        var description = req.body.description
                        var body = req.body.body
                        var slug1 = randomstring.generate({
                            length: 10,
                            charset: 'alphanumeric'
                        })
                        Article.findOne({ where: { author: profile.username } }).then(function (article) {
                            let db = new sqlite3.Database('./models/article3.db');
                            db.run(`update articles set title=?, description=?,body=?,slug=? where slug=?`, [newtitle, description, body, slug1, slug])
                            var pro = { username: profile.username, bio: profile.bio, image: profile.image, following: 'false' }
                            var artic = { slug: slug1, title: newtitle, description: description, body: body, createdAt: article.createdAt, updatedAt: article.updatedAt, author: pro }
                            res.status(201).json({ article: artic })
                        })
                    })
            }
        })
    });


//api to delete the particular article fully done acc to api
app.delete('/articles/:slug', (req, res) => {
    var token = req.headers['token'];
    if (!token) { return res.status(401).send({ auth: false, message: 'No token provided.' }); }
    const payload = jwt1.decode(token, config.secret, process.env.TOKEN_SECRET);
    var id = JSON.stringify(payload.sub)

    User.findOne({ where: [{ id: id }] })
        .then(function (user) {
            if (!user) {
                res.status(404).json({ message: 'The requested User does not exist' })
            } else {
                const slug1 = req.params.slug

                let db = new sqlite3.Database('./models/article3.db');
                db.run(`delete from articles where slug=?`, [slug1])
                res.status(201).json({ message: 'article deleted successfully' })
            }
        })
})

//api to get and post the comments

//api to post the comment on the particular article fully done acc to api
app.route('/articles/:slug/comments')
    .post((req, res) => {
        var token = req.headers['token'];
        if (!token) { return res.status(401).send({ auth: false, message: 'No token provided.' }); }
        const payload = jwt1.decode(token, config.secret, process.env.TOKEN_SECRET);
        var id = JSON.stringify(payload.sub)

        User.findOne({ where: [{ id: id }] })
            .then(function (user) {
                if (!user) {
                    res.status(404).json({ message: 'The requested User does not exist' })
                } else {
                    Profile.findOne({where:{email:user.email}}).then(function (profile){                      
                           
                        const slug = req.params.slug
                        Article.findOne({ where: { slug: slug } }).then(function (artone) {
                        CommentonArticle.create({
                            body: req.body.body
                        })
                            .then(commenton => {
                                var pro = { username: profile.username, bio: profile.bio, image: profile.image, following: 'false' }
                                var comments = { id:commenton.id,createdAt:commenton.createdAt,updatedAt:commenton.updatedAt,body:commenton.body, author: pro }
                                res.status(201).json(comments)
                                //res.status(201).json(pro)
                            })
                            .catch(error => {
                                res.status(403)
                            })
                    })
                    })

                    
                }
            })

    })
//to get all the comments on the particular article but not acc to api but still we can submit it like this if cant find any option,
app.route('/articles/:slug/comments')
    .get((req, res) => {
        const slug=req.params.slug
        Article.findOne({ where: { slug: slug } }).then(function (article){
            Profile.findOne({where:{username:article.author}}).then(function(profile){
                CommentonArticle.findAll().then(function (art) {
                    var pro = { username: profile.username, bio: profile.bio, image: profile.image, following: 'false' }
                   var comments = { comment:art,author: pro }
                                         
                    res.status(200).json(comments)
                   // console.log('my comments' + art)
                })
            })            
        })        
    })

//api to delete the particular comment and it is working fully acc to api
app.delete('/articles/:slug/comments/:cid', (req, res) => {
    var token = req.headers['token'];
    if (!token) { return res.status(401).send({ auth: false, message: 'No token provided.' }); }
    const payload = jwt1.decode(token, config.secret, process.env.TOKEN_SECRET);
    var id = JSON.stringify(payload.sub)
    User.findOne({ where: [{ id: id }] })
        .then(function (user) {
            if (!user) {
                res.status(404).json({ message: 'The requested User does not exist' })
            } else {
                const cid1 = parseInt(req.params.cid)
                let db = new sqlite3.Database('./models/test2.db');
                db.run(`delete from comments where id=?`, [cid1])
                res.status(201).json({ message: 'comment deleted successfully' })
            }
        })
})


//experiment with favt
app.route('/articles/:slug/favorite')
.post((req, res) => {
    var token = req.headers['token'];
    if (!token) { return res.status(401).send({ auth: false, message: 'No token provided.' }); }
    const payload = jwt1.decode(token, config.secret, process.env.TOKEN_SECRET);
    var id = JSON.stringify(payload.sub)

        User.findOne({ where: [{ id: id }] })
        .then(function (user) {
        if (!user) {
            res.status(404).json({ message: 'The requested User does not exist' })
        } else {
            const slug1 = req.params.slug
            Article.findOne({ where: [{ slug: slug1 }] })
            .then(function(article){
                var ab=article.favcount
                var a
                if(ab%2==0){
                    a=  ab+1
                }
                else{
                    a=ab-1
                }
             
              console.log('va;ue of a '+article.favcount+1)
              let db = new sqlite3.Database('./models/article4.db');
                db.run(`update articles set favcount=? where slug=?`,[a,slug1])
                res.status(201).json(article)

            })
            
           
        }
    })

    })


//exprmtn with tags post api
app.route('/tags')
    .post((req, res) => { 
        Tag.create({
            tags:req.body.tags
        }).then(tag => {
            if(!tag){
                res.status(400).json("message:error occured")
                }
            else{
            res.status(201).json(tag)
            }})
    })
    .get((req,res)=>{
        Tag.findAll().then(tag=>{
            res.status(201).json(tag)
        })
    })
  

app.get('/me', function (req, res) {
    var token = req.headers['token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, config.secret, function (err, decoded) {
        console.log('value of previous value of config.secret ' + config.secret)
        console.log('value of  value of token ' + token)

        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        res.status(200).send(decoded);
    });
});

app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.status(200)
    } else {
        res.status(400)
    }
});
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
});
// start the express server
app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));