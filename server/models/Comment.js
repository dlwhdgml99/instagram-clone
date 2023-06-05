const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  content: { type: String },
  article: { type: Schema.ObjectId, required: true },
  author: { type: Schema.ObjectId, required: true, ref: 'User' },
  created: { type: Date, default: Date.now },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

module.exports = mongoose.model('Comment', commentSchema);