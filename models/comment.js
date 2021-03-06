const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true },
});

module.exports = mongoose.model('Comment', commentSchema);
