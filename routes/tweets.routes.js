const router = require("express").Router()
const Tweet = require('./../models/Tweet.model')
const User = require('./../models/User.model')

// Ruta para obtener todos los tweets de un usuario
router.get("/getTweetsByOwner/:userId", (req, res, next) => {

  Tweet
    .find({ author: req.params.userId })
    .then(tweets => {
      res.json(tweets)
    })
    .catch(error => {
      next(error)
    })
})

// Ruta para obtener todos los tweets de un usuario que ha retuiteado
router.get("/getTweetsByRetweeter/:userId", (req, res, next) => {

  Tweet
    .find({ retweets: req.params.userId })
    .then(tweets => {
      res.json(tweets)
    })
    .catch(error => {
      next(error)
    })
})

// Ruta para crear un nuevo tweet
router.post("/createTweet", (req, res, next) => {

  const { content, likes, retweets } = req.body
  const _id = "64d265b068d09db354dc9077"

  Tweet
    .create({ author: _id , content, likes, retweets })
    .then(response => res.json(response))
    .catch(error => next(error))
}) //esto va a fallar hay que hacer desestructuracion nominal arriba (donde pone _id)

// Ruta para editar un tweet existente
router.put("/editTweet/:tweetId", (req, res, next) => {
  
  Tweet
    .findByIdAndUpdate(
      req.params.tweetId,
      { content: req.body.content },
      { new: true }
    )
    .then(updatedTweet => res.json(updatedTweet))
    .catch(error => next(error))
})

// Ruta para dar "me gusta" a un tweet
router.put("/likeTweet/:tweetId", (req, res, next) => {
  const tweetId = req.params.tweetId
  // const userId = req.payload.userId
  const _id = '64d22339b5bdd9ecb6f34741'

  Tweet
    .findById(tweetId)
    .then(tweet => {
      if (!tweet) {
        return res.status(404).json({ message: "Tweet not found" })
      }

      const userIndex = tweet.likes.indexOf(_id)

      if (userIndex === -1) {
        // Si el usuario no ha dado like, lo agregamos
        tweet.likes.push(_id)
      } else {
        // Si el usuario ya dio like, lo eliminamos
        tweet.likes.splice(userIndex, 1)
      }

      return tweet.save()
    })
    .then(updatedTweet => {
      res.json(updatedTweet)
    })
    .catch(error => {
      next(error)
    })
})


// Ruta para retuitear un tweet
router.put("/retweetTweet/:tweetId", (req, res, next) => {

  const tweetId = req.params.tweetId
  // const userId = req.payload.userId
  const userId = '64d265b068d09db354dc9077'

  Tweet.findById(tweetId)
    .then(tweet => {
      if (!tweet) {
        return res.status(404).json({ message: "Tweet not found" })
      }

      const userIndex = tweet.retweets.indexOf(userId)

      if (userIndex === -1) {
        // Si el usuario no ha retwitteado, se agrega el retweet
        tweet.retweets.push(userId)
      } else {
        // Si el usuario ya retwitteó, se elimina el retweet
        tweet.retweets.splice(userIndex, 1)
      }

      return tweet.save()
    })
    .then(updatedTweet => {
      // Ahora actualizamos los retweets en el usuario
      return User.findById(userId)
        .then(user => {
          const tweetIndex = user.retweeted.indexOf(updatedTweet._id)
          
          if (tweetIndex === -1) {
            // Si el tweet no está en el array, lo agregamos
            user.retweeted.push(updatedTweet._id)
          } else {
            // Si el tweet está en el array, lo quitamos
            user.retweeted.splice(tweetIndex, 1)
          }

          return user.save()
        })
    })
    .then(updatedUser => {
      res.json(updatedUser)
    })
    .catch(error => {
      next(error)
    })
})

// Ruta para eliminar un tweet
router.delete("/deleteTweet/:tweetId", (req, res, next) => {
  
  Tweet
    .findByIdAndRemove(req.params.tweetId)
    .then(deletedTweet => {
      res.json(deletedTweet)
    })
    .catch(error => {
      next(error)
    })
})

module.exports = router