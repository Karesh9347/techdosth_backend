const mongoose = require("mongoose");

const Contest = new mongoose.Schema({
    contestName: {
        type: String,
        required: true 
    },
    contestLink: {
        type: String,
        required: true 
    },
    contestLevel: {
        type: String,
        required: true 
    }
});

module.exports = mongoose.model("Contest", Contest);
