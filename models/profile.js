var Sequelize = require('sequelize')
var DT=Sequelize.DataTypes

var db = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/test2.db',
  })

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
   }


});
db.sync().then(() => console.log('profile table has been successfully created, if one doesn\'t exist'))
.catch(error => console.log('This error occured', error));
module.exports=Profile;
