const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

mongoose.connect("mongodb://localhost:27017/Kodeskool");
const app = express();

app.use(cors());
app.use(express.json());

// Available routes
// Authentication
const authenticate = require("./api/authenticate");
app.use('/api',authenticate);

// User Details
const userData = require("./api/userdata");
app.use('/api',userData);

// Course Api
const course = require("./api/course");
app.use('/api',course)


app.listen(5000, () => {
    console.log(`iNotebook backend listening at http://localhost:${5000}`)
  })