const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const port = process.env.PORT || 5000;

// Connect to MongoDB and start server
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`KodeSkool backend listening at http://localhost:${port}`);
    });
});
