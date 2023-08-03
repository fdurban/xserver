const router = require("express");

const User = require('./../models/User.model')

// Ruta para obtener todos los usuarios
router.get("/users", (req, res, next) => {
  User.find({})
    .then(users => {
      res.json(users)
    })
    .catch(err => {
      next(err)
    })
})

// Ruta para obtener un usuario por su ID
router.get("/users/:userId", (req, res, next) => {
  User.findById(req.params.userId)
    .then(user => {
      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" })
      } else {
        res.json(user)
      }
    })
    .catch(err => {
      next(err)
    })
})

// Ruta para seguir a un usuario
router.put("/followUser/:userId/:followUserId", (req, res, next) => {
  User.findByIdAndUpdate(
    req.params.userId,
    { $addToSet: { following: req.params.followUserId } },
    { new: true }
  )
    .then(updatedUser => {
      res.json(updatedUser)
    })
    .catch(err => {
      next(err)
    })
})

// Ruta para dejar de seguir a un usuario
router.put("/unfollowUser/:userId/:unfollowUserId", (req, res, next) => {
  User.findByIdAndUpdate(
    req.params.userId,
    { $pull: { following: req.params.unfollowUserId } },
    { new: true }
  )
    .then(updatedUser => {
      res.json(updatedUser)
    })
    .catch(err => {
      next(err)
    })
})

// Ruta para obtener los tweets de los usuarios que sigue un usuario
router.get("/getFollowingTweets/:userId", (req, res, next) => {
  User.findById(req.params.userId)
    .populate('following', 'tweets')
    .then(user => {
      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" })
      } else {
        const tweets = user.following.map(u => u.tweets).flat()
        res.json(tweets)
      }
    })
    .catch(err => {
      next(err)
    })
})

module.exports = router