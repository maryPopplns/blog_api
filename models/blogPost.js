const path = require('path');
const mongoose = require('mongoose');
const { commentSchema } = require(path.join(__dirname, '/comment'));

const Schema = mongoose.Schema;

const blogPostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  likes: { type: Number, default: 0 },
  comments: [commentSchema],
  // comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
