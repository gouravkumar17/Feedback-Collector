const mongoose = require('mongoose');

/**
 * Feedback schema for storing user feedback
 */
const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  category: {
    type: String,
    enum: ['general', 'bug', 'feature', 'complaint', 'compliment'],
    default: 'general'
  }
}, {
  timestamps: true
});

// Index for better search performance
feedbackSchema.index({ createdAt: -1 });
feedbackSchema.index({ category: 1 });

module.exports = mongoose.model('Feedback', feedbackSchema);