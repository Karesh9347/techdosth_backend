const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Questions = require("./schema");
const Coder = require("./usermodel"); // Ensure this path is correct

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Set the limit to 10 MB
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const MONGO_URI = 'mongodb+srv://naresh9848:Karesh9848@cluster1.94mleuj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1';

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("MongoDB connected");
})
.catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});
//get all questions
app.get('/questions', async (req, res) => {
    try {
        const questions = await Questions.find();
        res.status(200).json(questions);
    } catch (err) {
        res.status(500).json({ error: "Error fetching questions: " + err.message });
    }
});
// Add Question Endpoint
app.post('/add-question', async (req, res) => {
    const { QuestionName,description, problemlink, videolink, hashtags, difficulty, images,complexities } = req.body;
    try {
        const newQ = new Questions({
            QuestionName,
            description,
            problemlink,
            videolink,
            hashtags,
            difficulty, 
            images,
            complexities
        });
        await newQ.save();
        res.status(201).json("Question added successfully");
    } catch (err) {
        res.status(400).json({ error: "Error creating question: " + err.message });
    }
});
//add contest
app.post("/add-contest", async (req, res) => {
    const { contestName, contestLink, contestLevel } = req.body; // Use camelCase

    try {
        const newContest = new Contest({
            contestName, // Use camelCase
            contestLink, // Use camelCase
            contestLevel // Use camelCase
        });

        await newContest.save();
        res.status(201).json({ message: "Contest added successfully" });
    } catch (err) {
        res.status(500).json({ error: `Error in creating contest: ${err.message}` });
    }
});


//get contests  
app.get("/get-contest", async (req, res) => {
    try {
      const contests = await Contest.find();
      res.status(200).json(contests);  // Status code 200 for successful retrieval
    } catch (err) {
      res.status(500).json({ error: "Unable to fetch contests: " + err.message });
    }
  });
app.get('/questions/:id', async (req, res) => {
    const { id } = req.params;

    try {
      

        const question = await Questions.findById(id);
        if (!question) {
            console.log('Question not found');
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json(question);
    } catch (err) {
        console.error("Error fetching question:", err.message);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
});


// Register a new user
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await Coder.findOne({ username });
        if (user) {
            return res.status(401).json({ message: 'User already exists' });
        }

        user = new Coder({ username, password });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Login user
app.post('/login-users', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await Coder.findOne({ username });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Incorrect username or password' });
        }

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Hello Endpoint
app.get('/hello', (req, res) => {
    res.send("Hello, welcome!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
