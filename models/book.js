const sequelize = require("../config/config");
const {DataTypes} = require("sequelize");
// const BookRequest = require('./bookrequest')

const Books = sequelize.define('books', {
    title: DataTypes.TEXT,
    description: DataTypes.TEXT,
    category: DataTypes.TEXT,
    author: DataTypes.TEXT,
    publisher: DataTypes.TEXT,
    published_date: DataTypes.DATE,
    image:DataTypes.TEXT,
    isbn:DataTypes.TEXT,
    status: {
        type: DataTypes.INTEGER,
        defaultValue:0
    },
    uuid:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4 // Or DataTypes.UUIDV1
    }
})

module.exports= Books