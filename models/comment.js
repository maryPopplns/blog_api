const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true },
});

exports.commentModel = mongoose.model('Comment', commentSchema);
exports.commentSchema = commentSchema;
