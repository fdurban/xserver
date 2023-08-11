const router = require("express").Router()
const Tweet = require('./../models/Tweet.model')

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
  Tweet.find({ retweets: req.params.userId })
    .then(tweets => {
      res.json(tweets)
    })
    .catch(error => {
      next(error)
    })
})

// Ruta para crear un nuevo tweet
router.post("/createTweet", (req, res, next) => {

  // const {tweetData: content, likes, retweet} = req.body
  const { content, likes, retweet } = req.body
    // const { _id: author } = req.payload

  Tweet
  .create({ content, likes, retweet })
  .then(response => res.json(response))
  .catch(error => next(error))
})

// Ruta para editar un tweet existente
router.put("/editTweet/:tweetId", (req, res, next) => {

  Tweet
  .findByIdAndUpdate(req.params.tweetId,{ content: req.body.content },{ new: true })
  .then(updatedTweet => res.json(updatedTweet))
  .catch(error => next(error))
})

// Ruta para dar "me gusta" a un tweet
router.put("/toggleLikeTweet/:tweetId/:userId", (req, res, next) => {
  const tweetId = req.params.tweetId;
  const userId = req.params.userId;

  Tweet.findById(tweetId)
    .then(tweet => {
      if (!tweet) {
        return res.status(404).json({ message: "Tweet no encontrado" });
      }

      const likes = tweet.likes || []; // Manejo de tweets que no tienen el campo likes

      if (likes.includes(userId)) {
        // Si el usuario ya dio "me gusta", lo deslikemos
        Tweet.findByIdAndUpdate(
          tweetId,
          { $pull: { likes: userId } },
          { new: true }
        )
          .then(updatedTweet => {
            res.json(updatedTweet);
          })
          .catch(error => {
            next(error);
          });
      } else {
        // Si el usuario aún no dio "me gusta", lo likemos
        Tweet.findByIdAndUpdate(
          tweetId,
          { $addToSet: { likes: userId } },
          { new: true }
        )
          .then(updatedTweet => {
            res.json(updatedTweet);
          })
          .catch(error => {
            next(error);
          });
      }
    })
    .catch(error => {
      next(error);
    });
});


// Ruta para retuitear un tweet
router.put("/retweetTweet/:tweetId/:userId", (req, res, next) => {
  Tweet.findByIdAndUpdate(
    req.params.tweetId,
    { $addToSet: { retweets: req.params.userId } },
    { new: true }
  )
    .then(updatedTweet => {
      res.json(updatedTweet)
    })
    .catch(error => {
      next(error)
    })
})

// Ruta para eliminar un tweet
router.delete("/deleteTweet/:tweetId", (req, res, next) => {
  Tweet.findByIdAndRemove(req.params.tweetId)
    .then(deletedTweet => {
      res.json(deletedTweet)
    })
    .catch(error => {
      next(error)
    })
})

module.exports = router