const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [String],
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  edited: { type: Boolean, default: false }, // 👈 pridedama žyma dėl redagavimo
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);




