const sequelize = require("../config/config");
const {DataTypes} = require("sequelize");
// const BookRequest = require('./bookrequest')
const Admin = sequelize.define('admin', {

    firstname:DataTypes.STRING,
    lastname:DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
}, {
    timestamps:true
})

module.exports=Admin
