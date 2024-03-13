const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  avatar: String,
  room: String,
  text: String,
  file_name: String,
  type: Number,
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the sender user
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the receiver user
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;