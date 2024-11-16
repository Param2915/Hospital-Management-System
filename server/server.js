import express from 'express';
import { config } from 'dotenv';
import cors from "cors";
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';
import { dbConnection } from './config/dbConnection.js';
import messageRouter from "./routes/messageRouter.js";
import userRouter from "./routes/userRouter.js";
import { errorMiddleware } from "./middlewares/errorHandler.js";

const app = express();
config({ path: "./config/.env" });

// Cloudinary configuration
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware setup
app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    useTempFiles: true, 
    tempFileDir: "/tmp/",
}));

// Routes
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);

// Database connection
dbConnection();

// Error middleware
app.use(errorMiddleware);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
