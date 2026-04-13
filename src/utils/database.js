const mongoose = require("mongoose")
const { mongoDB } = require("../public/botconfig.json")
const logger = require("./others/logger")

async function connectDB() {
    try {
        mongoose.set("strictQuery", true);
        await mongoose.connect(mongoDB);
        logger.success('Connected to MongoDB')
    } catch (err) {
        logger.error('Error connecting to MongoDB:', err)
    }
}

module.exports = { connectDB };