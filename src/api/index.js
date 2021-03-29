const express = require('express')
const router = express.Router()
const auth = require('./auth')
const user = require('./user')
const mongoose = require('mongoose')
const expressJwt = require('express-jwt')
const { notFound } = require('../common/middleware')
const { errorRes } = require('../common/response')

router.get('/ping', (req, res) => res.json('pong'))
router.use('/auth', auth)
router.use(expressJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS512']  }),
        (err, req, res, next) => {
                if (err.name === 'UnauthorizedError') {
                    console.error(req.user, req.ip, 'invalid token')
                    return errorRes(res, err, 'Login to proceed', 401)
                }
        }
)

router.use('/user', user)
router.use(notFound)

module.exports = router;
