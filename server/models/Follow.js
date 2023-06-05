const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const followSchema = new Schema({
  follower: { type: Schema.ObjectId, required: true, ref: 'User' },
  following: { type: Schema.ObjectId, required: true, ref: 'User' }
}, { 
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

module.exports = mongoose.model('Follow', followSchema);