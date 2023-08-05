const sequelize = require("../config/config");
const {DataTypes} = require("sequelize");
const User = require('../models/user')
const Books = require('../models/book')


const BookRequest = sequelize.define('book_request', {
    uuid:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4 // Or DataTypes.UUIDV1
    },
    book_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Books, // 'Movies' would also work
            key: 'id'
        }
    },
    user_id:{
        type: DataTypes.INTEGER,
        references: {
            model: User, // 'Movies' would also work
            key: 'id'
        }
    },
    request_date: DataTypes.DATE,
    status:{
        type: DataTypes.INTEGER,
        defaultValue:0
    },
    due_date: DataTypes.DATE,
    pickup:DataTypes.TEXT

})

BookRequest.belongsTo(Books, {as: 'Books', foreignKey: 'book_id'});
BookRequest.belongsTo(User, {as: 'User', foreignKey: 'user_id'});


module.exports=BookRequest