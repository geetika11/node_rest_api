var Sequelize = require('sequelize')
var DT=Sequelize.DataTypes

var db=require('./index')
var Profile=db.define('profile',{
    username:{
        type: DT.STRING(50),
        unique:true,
        allowNull:false
    },
    email:{
        type:DT.STRING(30),
        unique:true,
        allowNull:false
    },
   image:{
       type:DT.STRING(200),
       allowNull:true
   },
   bio:{
       type:DT.STRING(500),
       allowNull:true
   },
   newpassword:{
       type:DT.STRING(30),
       allowNull:true
   }});

module.exports=Profile;
