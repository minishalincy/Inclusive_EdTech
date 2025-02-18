// remarkSchema.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["text", "voice"],
    required: true,
  },
  content: {
    type: String, // For text messages or voice file URL
    required: true,
  },
  sender: {
    type: String,
    enum: ["teacher", "parent"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const remarkSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classroom",
    required: true,
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Remark", remarkSchema);
