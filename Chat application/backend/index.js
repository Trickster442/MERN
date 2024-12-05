import express from "express";
import 'dotenv/config';
import mongoose from "mongoose";
import cors from 'cors';
import router from "./router/authRouter.js";
import postRouter from "./router/postRouter.js";

const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());
server.use('/api', router);
server.use('/post', postRouter)


// Ensure that .env variables are loaded
if (!process.env.MONGO_URL || !process.env.PORT) {
    console.error('Missing required environment variables: MONGO_URL or PORT');
    process.exit(1);  // Stop the application if MONGO_URL or PORT is not defined
}

const URL = process.env.MONGO_URL;

// Mongoose connection with async/await
const connectToDatabase = async () => {
    try {
        await mongoose.connect(URL, {
            useNewUrlParser: true,  // Use the new URL parser
            useUnifiedTopology: true,  // Use the unified topology engine
        });
        console.log("Connected to database successfully");
    } catch (err) {
        console.error("Error connecting to the database:", err);
        process.exit(1);  // Stop the app if MongoDB connection fails
    }
};

// Call the connect function
connectToDatabase();

// Basic route for home page
server.get('/', (req, res) => {
    res.status(200).send("This is the home page!!!");
});

// Start the server
server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
