const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const sequelize = require('./config/config')

const User = require('./models/user')
const Books = require('./models/book')
const BookRequests = require('./models/bookrequest')
const Inbox = require('./models/inbox')
const Admin = require('./models/admin')
const userRoute = require('./routes/userRoutes')
const adminRoute = require('./routes/adminRoutes')

const app = express()

require('dotenv').config()


app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


app.listen(process.env.PORT || 4000, async (req, res) => {
    console.log('server running')
    try {
        await sequelize.authenticate();
        await sequelize
            .sync({alter: true})
            .then((result) => {
                 
                console.log("All models were synchronized successfully.");
            })
            .catch((err) => {
                console.log(err);
            });


        console.log('Connection has been established successfully.');

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

})

app.get('/', (req, res) => {
    return res.json({
        message: 'library server is running'
    })
})
app.use('/api/user', userRoute)
app.use('/api/admin', adminRoute)
app.use('/uploads', express.static('uploads'));
app.use('*', (req, res) => {
    return res.status(404).send('Route not found')
})