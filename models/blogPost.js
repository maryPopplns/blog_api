const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const blogPostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  likes: Number,
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  date: { type: Date, default: Date.now },
});

// TODO create vituals for incrementing/decrementing likes

module.exports = mongoose.model('BlogPost', blogPostSchema);
