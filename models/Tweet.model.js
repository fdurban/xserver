const { Schema, model } = require("mongoose");

const tweetSchema = new Schema(
  {
    content: {
      type: String,
        required: true,
      maxlength: 280,
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    retweets: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  {
    timestamps: true,
  }
);

const Tweet = model("Tweet", tweetSchema);

module.exports = Tweet;