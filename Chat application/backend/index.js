import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import router from "./router/authRouter.js";
import postRouter from "./router/postRouter.js";
import friendRequestRouter from "./router/friendrequestRouter.js";
import { Server } from "socket.io";

const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());
server.use("/api", router);
server.use("/post", postRouter);
server.use("/request", friendRequestRouter);

// Ensure that .env variables are loaded
if (!process.env.MONGO_URL || !process.env.PORT) {
    console.error("Missing required environment variables: MONGO_URL or PORT");
    process.exit(1);
}

const URL = process.env.MONGO_URL;

// Mongoose connection with async/await
const connectToDatabase = async () => {
    try {
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to database successfully");
    } catch (err) {
        console.error("Error connecting to the database:", err);
        process.exit(1);
    }
};

// Call the connect function
connectToDatabase();

// Start the Express server
const PORT = process.env.PORT || 3000;
const expressServer = server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Attach Socket.IO to the running Express server
const io = new Server(expressServer, {
    cors: {
        origin: "*", // Allow all origins for development; restrict in production
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("A user connected");

    // Example event
    socket.on("message", (data) => {
        console.log("Message received:", data);
        socket.emit("response", { message: "Message received successfully" });
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

// Basic route for home page
server.get("/", (req, res) => {
    res.status(200).send("This is the home page!!!");
});
