//api to get all the user

const { Router } = require('express')
var User = require('./models/user')
const route = Router()
route.get('/usersall',(req, res) => {
        User.findAll().then(function (user) {
            res.status(200).json(user)
        });
    })

module.exports=route