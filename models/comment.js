var Sequelize = require('sequelize')
var DT=Sequelize.DataTypes

var db = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/test2.db',
  })

var CommentonArticle=db.define('comment',{
  
    body:{
        type:DT.STRING(30),
        allowNull:true,
        unique:true       
    },
    
});

db.sync().then(() => console.log('comment table has been successfully created'))
.catch(error => console.log('This error occured', error));

module.exports=CommentonArticle;
