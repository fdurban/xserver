const router = require('express').Router()

router.use("/tweets", require('./tweets.routes'))

module.exports = router