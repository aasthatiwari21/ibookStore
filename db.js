const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/inoteBook";

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1); // Exit the process if unable to connect
    }
};

module.exports = connectToMongo;
