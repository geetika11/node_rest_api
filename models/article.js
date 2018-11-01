var Sequelize = require('sequelize')
var DT = Sequelize.DataTypes

var db = new Sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/article4.db',
})

var Article = db.define('article', {
    title: {
        type: DT.STRING(50),
        allowNull: true,
       
    },
    description: {
        type: DT.STRING(30),
        allowNull: true,
        
    },
    body: {
        type: DT.STRING(30),
        allowNull: true,
        
    },
    slug: {
        type: DT.STRING(10),
        allowNull: true,
        
       
    },
    favcount:{
        type:DT.INTEGER(10)
    }
    ,
    author:{
        type:DT.STRING(30),
        allowNull: false,     

    }

});

db.sync().then(() => console.log('article table has been successfully created'))
    .catch(error => console.log('This error occured', error));

module.exports = Article;
