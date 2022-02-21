const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String },
  likes: [{ type: Schema.Types.ObjectId, ref: 'BlogPost' }],
});

module.exports = mongoose.model('User', userSchema);
