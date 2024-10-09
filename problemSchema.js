const mongoose = require("mongoose");

const Problems = new mongoose.Schema({
  QuestionName: {
    type: String,
    required: true,
  },
  actualcode: {
    type: String,
    required: true,
  },
  videolink: {
    type: String,
    required: true,
  },
  hashtags: {
    type: [String],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  driverCode: {
    type: String,
    required: true,
  },
  solution: {
    pythonBruteForce: {
      type: String,
      required: true,
    },
    pythonBetter: {
      type: String,
    },
    pythonOptimized: {
      type: String,
    },
  },
  complexities: {
    tc1: {
      type: String,
    },
    sc1: {
      type: String,
    },
    tc2: {
      type: String,
    },
    sc2: {
      type: String,
    },
    tc3: {
      type: String,
    },
    sc3: {
      type: String,
    },
  },
  comments: [
    {
      username: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Problems", Problems);
