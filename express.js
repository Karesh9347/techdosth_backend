
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Questions = require("./schema");
const Coder = require("./usermodel"); // Ensure this path is correct
const Contest=require("./contestSchema")
const Aptitude=require("./aptitudeSchema")
const interview=require("./interview")
const Query=require("./querySchema")
const Problems=require("./problemSchema")
const { exec } = require('child_process');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' })); // Set the limit to 10 MB
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const MONGO_URI = 'mongodb+srv://naresh9848:Karesh9848@cluster1.94mleuj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1';

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

//excute python code
const { Pool } = require('pg');

const pool = new Pool({
  user: 'admin',
  host: 'us-east-1.817ee814-63db-4082-8bbf-92d3f72d9052.aws.yugabyte.cloud',
  database: 'yugabyte',
  password: 'oWEZSiDkZ9VNIcQZby2lZ9-IICGBCY',
  port: 9042,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 20000, // 20 seconds timeout
});

// Event listener for connection success
const connectAndExecute = async () => {
    const client = await pool.connect(); // Get a client from the pool
    try {
      console.log('Connected to YugabyteDB successfully!');
  
     
    } catch (err) {
      console.error('Error executing query:', err.message);
    } finally {
      client.release(); // Release the client back to the pool
      console.log('Connection released back to the pool.');
    }
  };
  
  // Call the function to connect and execute the query
  connectAndExecute();

// Example function to run queries using the pool
const executeQueryWithPool = async (query) => {
  const client = await pool.connect();
  try {
    const result = await client.query(query);
    return result.rows;
  } catch (err) {
    console.error('Error executing query:', err.message);
    throw err;
  } finally {
    client.release();
  }
};
//excute python
const { spawn } = require('child_process');
app.post('/execute-python', (req, res) => {
  const code = req.body.code; // Assume code is passed from frontend

  // Save code to a temporary Python file
  const fs = require('fs');
  const path = require('path');
  const tempFilePath = path.join(__dirname, 'temp_script.py');
  fs.writeFileSync(tempFilePath, code);

  // Execute the Python script
  const pythonProcess = spawn('python', [tempFilePath]);

  let output = '';
  let error = '';

  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    error += data.toString();
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      res.json({ output });
    } else {
      res.status(500).json({ error: error || 'An error occurred' });
    }
  });
});
//add problem of the day
app.post("/add-problem-of-the-day", async (req, res) => {
  const { QuestionName, actualcode, videolink, hashtags, difficulty, description, driverCode, solution, complexities } = req.body;

  try {
    const newProblem = new Problems({
      QuestionName,
      actualcode,
      videolink,
      hashtags,
      difficulty,
      description,
      driverCode,
      solution,
      complexities,
    });

    const savedProblem = await newProblem.save();
    res.status(201).json(savedProblem);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error adding problem", error });
  }
});


// Get all problems
app.get("/get-all-problems", async (req, res) => {
  try {
    const problems = await Problems.find();
    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching problems", error });
  }
});

// Get a single problem by ID
app.get("/get-problem/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const problem = await Problems.findById(id);
    if (problem) {
      res.status(200).json(problem);
    } else {
      res.status(404).json({ message: "Problem not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching problem", error });
  }
});
//add query of the day
app.post('/add-query', async (req, res) => {
    const { shortName, description, actualQuery, difficultyLevel, relatedTopics } = req.body;
  
    try {
      const newQuery = new Query({
        shortName,
        description,
        actualQuery,
        difficultyLevel,
        relatedTopics
      });
  
      const savedQuery = await newQuery.save(); // Ensure you call save on the instance
      res.status(201).json(savedQuery);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Error adding query', error });
    }
  });
  //get all ueries
  app.get('/get-all-queries', async (req, res) => {
    try {
      const queries = await Query.find(); 
      res.status(200).json(queries); 
    } catch (error) {
      console.error('Error fetching queries:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  
// Get query by ID (GET /get-query/:id)
  app.get('/get-query/:id', async (req, res) => {
    try {
      const query = await Query.findById(req.params.id);
      if (!query) {
        return res.status(404).json({ message: 'Query not found' });
      }
  
      // Send the query details back as a response
      res.status(200).json(query);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching query', error });
    }
  });
//excute query 
app.post('/execute-query', async (req, res) => {
    const { query } = req.body;
  
    try {
      const result = await executeQueryWithPool(query); // Your DB query execution logic
      return res.json({ result }); // Return result on success
    } catch (err) {
      console.log('Error details:', err.code); // Log the full error for debugging
      
      // Return a response with the error message, but status 200 to handle in frontend
      if (err.message) {
        res.status(200).json({ error: `Error executing query: ${err.message}` });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred.' });
      }
    }
  });
  //add interview
app.post('/add-interview', async (req, res) => {
    const { subject, question, answer, resource } = req.body;

    try {
        const newInterview = new interview({ subject, question, answer, resource });
        await newInterview.save();
        res.status(201).json({ message: 'Interview added successfully', interview: newInterview });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to get all interviews
app.get('/get-interview', async (req, res) => {
    try {
        const interviews = await interview.find();
        res.status(200).json(interviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
  
//add aptitude questions
app.post("/add-aptitude", async (req, res) => {
    const { questionName, difficultyLevel, description, solution, hashtags } = req.body;
    
    // Check for required fields
    if (!questionName || !difficultyLevel || !description || !solution) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Create a new Aptitude question with hashtags (if provided)
        const newAQ = new Aptitude({
            questionName,
            difficultyLevel,
            description,
            solution,
            hashtags: hashtags ? hashtags : [] // Default to an empty array if hashtags are not provided
        });

        // Save the new question in the database
        await newAQ.save();

        // Respond with a success message and the saved question
        res.status(201).json({ message: "Aptitude question added successfully", data: newAQ });
    } catch (err) {
        res.status(500).json({ error: "Error creating question: " + err.message });
    }
});
//get all aptitude questions
app.get("/get-aptitude",async(req,res)=>{
    try{
        const questions=await Aptitude.find()
        res.status(200).json(questions)
    }catch(err){
        res.status(500).json({error:"err in getting aptitude questins"+err.message})
    }
})

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
//get question individually
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
//get single contest
app.get('/contest/:id', async (req, res) => {
    const { id } = req.params;

    try {
      

        const question = await Contest.findById(id);
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
// get one aptitude question
app.get('/aquestions/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const question = await Aptitude.findById(id);
        if (!question) {
            console.log('Question not found');
            return res.status(404).json({ message: 'Question not found' });
        }

        res.status(200).json(question);
    } catch (err) {
        // Log the complete error for debugging
        console.error("Error fetching question:", err.stack);

        // Send an appropriate error response
        res.status(500).json({ message: 'Server error, please try again later' });
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
