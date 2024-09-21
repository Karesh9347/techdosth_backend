const mongoose = require("mongoose");

const AptitudeSchema = new mongoose.Schema({
    questionName: {
        type: String,
        required: true,
        trim: true, // Removes any leading/trailing spaces
    },
    difficultyLevel: {
        type: String,
        required: true,
        enum: ['Easy', 'Medium', 'Hard'], // Restricts difficulty level to these values
    },
    description: {
        type: String,
        required: true,
    },
    solution: {
        type: String,
        required: true,
    },
    hashtags: {
        type: [String], // Array of strings for multiple hashtags
        default: [], // Default value is an empty array
    }
}, { timestamps: true }); // Adds createdAt and updatedAt fields

const Aptitude = mongoose.model("Aptitude", AptitudeSchema);
module.exports = Aptitude;
