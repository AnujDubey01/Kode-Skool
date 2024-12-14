const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

mongoose.connect("mongodb://localhost:27017/");
const app = express();

app.use(cors());
app.use(express.json());

// Available routes
const authenticate = require("./api/authenticate");
app.use('/api',authenticate);


app.listen(5000, () => {
    console.log(`iNotebook backend listening at http://localhost:${5000}`)
  })