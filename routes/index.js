const router = require('express').Router()

router.use("/tweets", require('./tweets.routes'))

router.use("/users", require('./users.routes'))

router.use('/auth', require('./auth.routes'))

// router.use('/upload', require('./upload.routes'))

module.exports = router