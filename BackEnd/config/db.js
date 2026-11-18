const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const rawUri = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://localhost:27017/Kodeskool";
        const mongoUri = rawUri.trim();
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
