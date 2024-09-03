const mongoose = require("mongoose");

const CoderSchema = new mongoose.Schema({
    username: {
        type: String,  // Corrected 'tyep' to 'type'
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Coder", CoderSchema);
