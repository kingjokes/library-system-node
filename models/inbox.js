const sequelize = require("../config/config");
const {DataTypes} = require("sequelize");
const Books = require("./book");
const User = require("./user");

const Inbox = sequelize.define('inbox', {
    uuid:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4 // Or DataTypes.UUIDV1
    },
    book_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Books,
            key: 'id',

        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',

        }
    },
    subject: DataTypes.TEXT,
    message: DataTypes.TEXT,

})

Inbox.belongsTo(Books, {as: 'Books', foreignKey: 'book_id'});
Inbox.belongsTo(User, {as: 'User', foreignKey: 'user_id'});


module.exports = Inbox

