//api to post the article fully done acc to api
const { Router } = require('express')
var User = require('./models/user')
const route = Router()
var Article = require('./models/article')
var Profile = require('./models/profile')
var authorization=require('./auth')
var randomstring = require('randomstring')

route.post('/articles',(req, res) => {
    console.log('before calling authorization')
    var token=req.headers['token']
    console.log('=====')
    console.log('value of token inside post article'+token)
    var id=authorization(token,req, res)
    //console.log("=======================>")
    //console.log("=========>"+JSON.stringify(user1))
   //function flow will come here only when authorized   
   console.log('after calling authorization' )
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

module.exports=route