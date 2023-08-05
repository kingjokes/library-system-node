const User = require('../models/user')
const Books = require('../models/book')
const BookRequest = require('../models/bookrequest')
const Inbox = require('../models/inbox')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sequelize = require('../config/config')
const {where} = require("sequelize");
const register = async (req, res) => {

    try {
        let find = await User.findOne({where: {email: req.body.email}})
        if (find === null) {
            let payload = {...req.body}
            payload.password = await bcrypt.hash(req.body.password, 10)
            let query = await User.create({...payload})
            if (query) {
                return res.json({
                    status: true,
                    message: 'Account created successfully'
                })
            }
            return res.json({
                status: false,
                message: 'Unable to create account'
            })
        }
        return res.json({
            status: false,
            message: 'Account already exist'
        })

    } catch (e) {
        return res.json({
            status: false,
            message: 'An error occurred',
            error: e.message
        })
    }


}

const login = async (req, res) => {
    try {

        let query = await User.findOne({where: {[req.body.field]: req.body.username}})


        if (query) {
            // console.log(query.password, req.body.password)
            let checker = await bcrypt.compare(req.body.password, query.password)
            if (checker) {
                const accessToken = await jwt.sign(
                    {
                        id: query.id
                    },
                    process.env.USER_ACCESS_TOKEN,
                    {expiresIn: '2h'}
                )
                res.setHeader('user-authToken', accessToken)
                res.cookie('user-authToken', accessToken, {
                    httpOnly: true,
                    maxAge: 2 * 60 * 60 * 1000,
                    sameSite: 'None'
                })

                return res.json({
                    message: 'Login successful, redirecting now...',
                    status: true,
                    accessToken: accessToken
                })
            }
            return res.json({
                message: "Invalid Password Credential",
                status: false
            })
        }
        return res.json({
            message: "Account not found",
            status: false
        })
    } catch (e) {
        return res.json({
            status: false,
            message: 'An error occurred',
            error: e.message
        })

    }

}

const getBooks = async (req, res) => {
    try {
        let query = await Books.findAll({order: sequelize.random()})
        return res.json({
            status: true,
            message: 'books retrieved',
            data: query
        })
    } catch (e) {
        return res.json({
            status: false,
            message: 'An error occurred',
            error: e.message
        })
    }

}

const getBorrowBooks = async (req, res) => {
    try {
        let query = await BookRequest.findAll(
            {
                where: {
                    user_id: req.user_id,
                },
                include: {
                    model: Books,
                    as: 'Books'
                }
            })

        return res.json({
            status: true,
            message: 'borrowed books fetched',
            data: query
        })


    } catch (e) {
        return res.json({
            status: false,
            message: 'An error occurred',
            error: e.message
        })
    }
}

const getInbox = async (req, res) => {
    try {
        let query = await Inbox.findAll(
            {
                where: {
                    user_id: req.user_id,
                },
                include: {
                    model: Books,
                    as: 'Books'
                }
            })

        return res.json({
            status: true,
            message: 'inbox message fetched',
            data: query
        })


    } catch (e) {
        return res.json({
            status: false,
            message: 'An error occurred',
            error: e.message
        })
    }
}

const getDetails = async (req, res) => {
    try {
        let query = await User.findOne({
            where: {id: req.user_id},

        })
        if (query) {
            return res.json({
                status: true,
                message: 'user details fetched',
                details: query
            })
        }
        return res.json({
            status: false,
            message: 'user not found'
        })
    } catch (e) {
        return res.json({
            status: false,
            message: 'An error occurred',
            error: e.message
        })
    }

}

const getBookDetails = async (req, res) => {
    try {
        let query = await Books.findOne({where: {id: req.params.id}})
        if (query) {
            return res.json({
                status: true,
                message: 'book details fetched ',
                details: query
            })
        }
        return res.json({
            status: false,
            message: 'book not found ',
        })
    } catch (e) {
        return res.json({
            status: false,
            message: 'An error occurred',
            error: e.message
        })
    }


}

const getBorrowedBookDetails = async (req, res) => {


    try {

        let query = await BookRequest.findOne({
            where: {id: req.params.id},
            include: {
                model: Books,
                as: 'Books'
            }
        })
        if (query) {
            return res.json({
                status: true,
                message: 'borrowed book details fetched ',
                details: query
            })
        }
        return res.json({
            status: false,
            message: 'borrowed book not found ',
        })
    } catch (e) {
        return res.json({
            status: false,
            message: 'An error occurred',
            error: e.message
        })
    }
}

const changePassword = async (req, res) => {
    try {

        let query = await User.findOne({
            where: {id: req.user_id},
        })

        if (query) {
            let checker = await bcrypt.compare(req.body.oldPassword, query.password)
            if (checker) {
                let password = await bcrypt.hash(req.body.password, 10)
                let create = await User.update({
                    password
                }, {
                    where: {id: req.user_id}
                })
                if (create) {
                    return res.json({
                        status: true,
                        message: 'password changed successfully'
                    })
                }
                return res.json({
                    status: false,
                    message: 'Unable to change user password'
                })
            }
            return res.json({
                status: false,
                message: 'Incorrect old Password'
            })

        }
        return res.json({
            status: false,
            message: 'User not found'
        })

    } catch (e) {
        return res.json({
            status: false,
            message: 'An error occurred',
            error: e.message
        })
    }


}
const orderBook = async (req, res) => {

    try {
        let query = await BookRequest.create({
            ...req.body
        })


        if (query) {
            return res.json({
                status: true,
                message: req.body.status === 0 ? 'Book order request placed successfully' : 'Book reserve request placed successfully'
            })
        }
        return res.json({
            status: false,
            message: 'Unable to  submit book request '
        })

    } catch (e) {
        return res.json({
            status: false,
            message: 'An error occurred',
            error: e.message
        })
    }
}

const returnBook = async (req, res) => {
    try {
        let query = await BookRequest.update(
            {status: 4},
            {where: {user_id: req.body.user_id, book_id: req.body.book_id}}
        )
        if (query) {
            return res.json({
                status: true,
                message: "Book return request submitted successfully"
            })
        }
        return res.json({
            status: false,
            message: 'Unable to  submit book return request '
        })
    } catch (e) {
        return res.json({
            status: false,
            message: 'An error occurred',
            error: e.message
        })
    }

}
module.exports = {
    login,
    register,
    getBooks,
    getDetails,
    getBorrowBooks,
    getInbox,
    getBookDetails,
    getBorrowedBookDetails,
    changePassword,
    orderBook,
    returnBook

}