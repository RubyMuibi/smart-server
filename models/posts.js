const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  post: {
    type: String,
    required: true,
  },

  category: {
    type: String
  },

  likes: {
    type: Number,
    default: 0
  }
});

const postModel = mongoose.model("posts", postSchema);

module.exports = postModel;
