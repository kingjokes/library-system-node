const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const User = require("../models/user")
const jwt = require("jsonwebtoken");
const Books = require("../models/book");
const sequelize = require("../config/config");
const Inbox = require("../models/inbox");
const BookRequest = require("../models/bookrequest");


const login = async (req, res) => {
    try {

        let query = await Admin.findOne({where: {email: req.body.email}})
        if (query) {
            // console.log(query.password, req.body.password)
            let checker = await bcrypt.compare(req.body.password, query.password)
            if (checker) {
                const accessToken = await jwt.sign(
                    {
                        id: query.id
                    },
                    process.env.ADMIN_ACCESS_TOKEN,
                    {expiresIn: '2h'}
                )
                res.setHeader('admin-authToken', accessToken)
                res.cookie('admin-authToken', accessToken, {
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
const getInbox = async (req, res) => {
    try {
        let query = await Inbox.findAll(
            {
                include: [
                    {
                        model: Books,
                        as: 'Books'
                    },
                    {
                        model: User,
                        as: 'User'
                    },
                ]
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

const getUsers = async (req, res) => {
    try {
        let query = await User.findAll()

        return res.json({
            status: true,
            message: 'users fetched successfully',
            data:query
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
        let query = await Admin.findOne({
            where: {id: req.admin_id},

        })
        if (query) {
            return res.json({
                status: true,
                message: 'admin details fetched',
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

        let query = await Admin.findOne({
            where: {id: req.body.id},
        })

        if (query) {
            let checker = await bcrypt.compare(req.body.oldPassword, query.password)
            if (checker) {
                let password = await bcrypt.hash(req.body.password, 10)
                let create = await Admin.update({
                    password
                }, {
                    where: {id: req.body.id}
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
            message: 'Admin not found'
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
                include: [
                    {
                        model: Books,
                        as: 'Books'
                    },
                    {
                        model: User,
                        as: 'User'
                    },

                ]
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
const deleteBooks = async (req, res) => {
    try {
        let deleteInbox = await Inbox.destroy({
            where:{
                book_id:req.body.id
            }
        })
        let sql = await BookRequest.destroy({
            where:{
                book_id:req.body.id
            }
        })
        let query = await Books.destroy({
            where: {
                id: req.body.id
            }
        });

        if (query) return res.json({
            status: true,
            message: 'Book deleted successfully'
        })
        return res.json({
            status: false,
            message: 'unable to delete book'
        })
    } catch (e) {
        return res.json({
            status: false,
            message: 'An error occurred',
            error: e.message
        })
    }


}
const updateBook = async (req, res) => {
    try {
        let query = await Books.update({
            ...req.body
        }, {
            where: {
                id: req.body.id
            }
        });

        if (query) return res.json({
            status: true,
            message: 'Book details updated successfully'
        })
        return res.json({
            status: false,
            message: 'unable to update book details'
        })
    } catch (e) {
        return res.json({
            status: false,
            message: 'An error occurred',
            error: e.message
        })
    }


}
const addBook = async (req, res) => {
    try {
        let image=`/uploads/${req.file.filename}`;
        let query = await Books.create({
            image,
            ...req.body
        });

        if (query) return res.json({
            status: true,
            message: 'Book added successfully'
        })
        return res.json({
            status: false,
            message: 'unable to add book '
        })
    } catch (e) {
        return res.json({
            status: false,
            message: 'An error occurred',
            error: e.message
        })
    }


}

const approveBookRequest = async (req, res) => {
    try {
        let query = await BookRequest.update({
                status: req.body.status
            }, {
                where: {
                    id: req.body.id
                }
            }
        )
        let sql = await Books.update({
            status: req.body.status===2 ? 0 : 1
        }, {where: {
                id: req.body.book_id
            }})
        if (query && sql) return res.json({
            status: true,
            message: 'Book request updated successfully'
        })
        return res.json({
            status: false,
            message: 'unable to update book request'
        })

    } catch (e) {
        return res.json({
            status: false,
            message: 'An error occurred',
            error: e.message
        })
    }
}
const sendMessage = async (req, res)=>{
    try{
        let query = await Inbox.create({
            ...req.body
        })

        if (query) return res.json({
            status: true,
            message: 'Message sent successfully'
        })
        return res.json({
            status: false,
            message: 'unable to send message '
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
    getDetails,
    getBookDetails,
    getBorrowedBookDetails,
    changePassword,
    getBooks,
    getInbox,
    getBorrowBooks,
    getUsers,
    deleteBooks,
    updateBook,
    approveBookRequest,
    addBook,
    sendMessage
}