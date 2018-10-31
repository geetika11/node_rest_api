var Sequelize = require('sequelize')
var DT=Sequelize.DataTypes

var db = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/test2.db',
  })

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

db.sync().then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
.catch(error => console.log('This error occured', error));
module.exports=User;
