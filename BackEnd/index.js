require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require('axios');

const port = process.env.PORT || 5000;
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/Kodeskool")
    .then(() => console.log("Connected to MongoDB"),
                console.log(process.env.MONGO_URI))
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View Engine Setup
app.set("view engine", "pug");
app.set("views", "./views");
app.use('/static', express.static('static'))

//Pages Routes
app.get('/', (req, res) => {
  try {
    res.render('home.pug');
  } catch (error) {
    res.status(500).send({err: error ,msg: "Internal Server Error"});
  }
})

app.get('/login', (req, res) => {
  try {
    res.render('login.pug');
  } catch (error) {
    res.status(500).send({err: error ,msg: "Internal Server Error"});
  }
})

app.post('/register', async (req, res) => {
  try {
    const response = await axios.post(`http://localhost:${port}/api/register/student`, req.body);
    const data = response.data;

    if(data.success){
      const queryParams = new URLSearchParams({ msg: data.msg, auth_token: data.auth_token }).toString();
      res.redirect(`${frontendUrl}/dashboard?${queryParams}`);
    }else{
      res.status(400).render('login.pug', {data: data});
    }    
  } catch (error) {
    console.error('Error during register:', error.message);
    res.status(500).send({
      error: error.response ? error.response.data : 'Unknown error',
      message: 'Internal Server Error',
    });
  }
})

app.post('/login', async (req, res) => {
  try {
    const response = await axios.post(`http://localhost:${port}/api/login`, req.body);
    const data = response.data;

    if (data.success) {
      const queryParams = new URLSearchParams({ msg: data.msg, auth_token: data.auth_token }).toString();
      res.redirect(`${frontendUrl}/dashboard?${queryParams}`);
    } else {
      res.status(400).render('login.pug', { data });
    }
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).send({
      error: error.response ? error.response.data : 'Unknown error',
      message: 'Internal Server Error',
    });
  }
});

// Available API Routes
// Authentication
const authenticate = require("./api/authenticate");
app.use('/api', authenticate);

// User Details
const userData = require("./api/userdata");
app.use('/api', userData);

// Course Api
const course = require("./api/course");
app.use('/api', course);


app.listen(port, () => {
    console.log(`KodeSkool backend listening at http://localhost:${port}`)
});
