var Profile=require('../models/profile')
var User = require('../models/user')
const { Router } = require('express')
var config = require('../config');
const route = Router()
var jwt1 = require('jwt-simple')
const sqlite3 = require('sqlite3');
var authorization=require('../auth')
let db = new sqlite3.Database('./models/database.db');

//api to signup
route.post('/users',(req, res) => {

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
    });

//api to login the user fully done acc to api
route.post('/users/login',(req, res) => {
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
           
    });



//api to get the current user fully done acc to api
route.get('/user',(req, res) => {
        var token = req.headers['token'];
        var id=authorization(token,req, res)
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
           
    })

    //update the current user fully done acc to api
 .put('/user',(req, res) => {
        var email = req.body.email
        var username = req.body.username
        var password = req.body.password
        var image = req.body.image
        var bio = req.body.bio
        var token = req.headers['token'];
        var token1 = token
        var id=authorization(token,req, res)   
        User.findOne({ where: [{ id: id }] }).then(function (user) {
            if (!user) {
                res.status(404).json({ message: 'The requested User does not exist' })
            } else {                
                Profile.findOne({ where: [{ email: user.email }] })
                    .then
                    (function (profile) {
                        db.run(`update users set username=?,email=?,password=? where id=?`, [username, email, password, id])
                        db.run(`update profiles set username=?,email=?,newpassword=?,bio=?,image=? where username=?`, [username, email, password, bio, image, profile.username])
                        var updateuser = { email: profile.email, token: token1, username: profile.username, bio: profile.bio, image: profile.image }
                    res.status(201).json({ user: updateuser })
                        
                    })
            }
        }) 
             
    });

    module.exports=route