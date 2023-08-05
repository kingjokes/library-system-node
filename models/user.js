const sequelize = require("../config/config");
const {DataTypes} = require("sequelize");
// const BookRequest = require('./bookrequest')
const User = sequelize.define('user', {

    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    address: DataTypes.TEXT,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    role: DataTypes.STRING,
    dept: DataTypes.STRING,
    matric: {
        type: DataTypes.STRING,
        defaultValue: null,
    },
    staff_id: {
        type: DataTypes.STRING,
        defaultValue: null,
    },
    password: DataTypes.STRING,
}, {
    timestamps:true
})

module.exports=User
