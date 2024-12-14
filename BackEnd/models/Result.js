const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  Std_ID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  Test_ID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true,
  },
  Test_Submitted_Date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  Status: {
    type: String,
    enum: ['Pending','Declared'],
    required: true
  },
  Score: {
    type: Number,
    required: true,
    min: 0,
  },
}, {
  timestamps: true,
});

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;
