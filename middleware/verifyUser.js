const jwt = require('jsonwebtoken')

require('dotenv').config()

//token verify  middleware
const verifyToken = async (req, res, next)=>{


    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token) {
        return res.status(403).send({
            status: false,
            message: 'Unauthorized access'
        })
    }

    //verify user token
    jwt.verify(
        token,
        process.env.USER_ACCESS_TOKEN,
        (err,decoded)=>{

            if(err) return res.status(401).send({
                status: false,
                message: 'Invalid Token'
            })

            req.user_id = decoded.id
            next()
        }
    )




}


module.exports= verifyToken