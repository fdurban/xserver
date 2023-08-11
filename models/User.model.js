const { Schema, model } = require("mongoose")

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    tweets: [{
      type: Schema.Types.ObjectId,
      ref: 'Tweet'
    }],
    retweeted:[{
      type: Schema.Types.ObjectId,
      ref: 'Tweet'
    }],
    following: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    followers: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
