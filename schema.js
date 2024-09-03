const mongoose=require("mongoose")
const Questions= new mongoose.Schema({
    QuestionName: {
        type: String,
        required: true,
    },
    problemlink: {
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
        enum: ['Easy', 'Medium', 'Hard'], // Enum to enforce allowed difficulty levels
        required: true,
    },
    description:{
        type:String,
        reuired:true

    },
    images: {
        cppBruteForce: {
            type: String, // Store Base64 encoded image
            required: true
        },
        cppOptimized: {
            type: String, // Store Base64 encoded image
            required: true
        },
        cppBetter: {
            type: String, // Store Base64 encoded image
            required: true
        },
        javaBruteForce: {
            type: String, // Store Base64 encoded image
            required: true
        },
        javaOptimized: {
            type: String, // Store Base64 encoded image
            required: true
        },
        javaBetter: {
            type: String, // Store Base64 encoded image
            required: true
        },
        pythonBruteForce: {
            type: String, // Store Base64 encoded image
            required: true
        },
        pythonOptimized: {
            type: String, // Store Base64 encoded image
            required: true
        },
        pythonBetter: {
            type: String, // Store Base64 encoded image
            required: true
        }
    },
    complexities:{
        tc1:{
            type:String,
        },
        sc1:{
            type:String,
        },
        tc2:{
            type:String,
        },
        sc2:{
            type:String,
        },
        tc3:{
            type:String,
        },sc3:{
            type:String,
        }

            
    }
});
module.exports=mongoose.model("Questions",Questions)