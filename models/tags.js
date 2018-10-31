var Sequelize = require('sequelize')
var DT=Sequelize.DataTypes

var db = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/test2.db',
  })

var Tag=db.define('tag',{
    tags:{
        type: DT.STRING(50),
        unique:true,
        allowNull:false
    }


});
db.sync().then(() => console.log('tags table has been successfully created, if one doesn\'t exist'))
.catch(error => console.log('This error occured', error));
module.exports=Tag;
