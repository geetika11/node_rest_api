var Sequelize = require('sequelize')
var DT=Sequelize.DataTypes
var db=require('./index')


var User=db.define('user',{
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
    password:{
        type:DT.STRING(30),
        allowNull:false
    }
    
});
module.exports=User;
