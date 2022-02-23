const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const blogPostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  likes: { type: Number, default: 0 },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  date: { type: Date, default: Date.now },
});

blogPostSchema.virtual('inc').set(function () {
  this.likes = this.likes + 1;
});

blogPostSchema.virtual('dec').set(function () {
  this.likes = this.likes - 1;
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
