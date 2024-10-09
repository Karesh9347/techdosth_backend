const mongoose = require('mongoose');

const queryOfDaySchema = new mongoose.Schema({
  shortName: {
    type: String,
    required: true,
    unique: true,  // Ensures each query has a unique short name
  },
  description: {
    type: String,
    required: true,
  },
  actualQuery: {
    type: String,
    required: true,  // The actual SQL query
  },
  difficultyLevel: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],  // Allows only specific difficulty levels
    required: true,
  },
  relatedTopics: [
    {
      type: String,  // List of related topics like 'Joins', 'Subqueries', etc.
    }
  ],
  postedDate: {
    type: Date,
    default: Date.now,
  },
});

const QueryOfDay = mongoose.model('QueryOfDay', queryOfDaySchema);
module.exports = QueryOfDay;
