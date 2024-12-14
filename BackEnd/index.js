const express = require("express");
const mongoose = require("monogoose");
const cors = require("cors");

mongoose.connect("monogdb://localhost:27017/");
const app = express();

app.use(cors());
app.use(express.json());

// Available routes


app.listen(port, () => {
    console.log(`iNotebook backend listening at http://localhost:${port}`)
  })