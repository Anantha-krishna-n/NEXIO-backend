import dotenv from "dotenv"
dotenv.config()
import express,{Application} from "express"
import mongoose from "mongoose"
import cors from "cors"
import passport from "passport";
import session from "express-session";
import "./config/passport"
import cookieParser from "cookie-parser"
import { connectToDatabase } from "./infrastructure/databse/connection-config"
import authRoutes from "./presentation/routes/authRoutes"
import adminRoutes from "./presentation/routes/adminRoutes"
import classroomRoute from "./presentation/routes/classroomRoute"
import messageRoute from "./presentation/routes/messageRoutes"
import whiteboardRoute from "./presentation/routes/whiteboardRoutes"
import documentRoute from "./presentation/routes/documentRoute"
import logger from "./presentation/middlewares/logger";
import { cleanupUnverifiedUsers } from "./presentation/utils/cleanupUnverifiedUsers";
import cron from "node-cron";
import http, { createServer } from "http"
import { Server } from "socket.io"
import { Socket } from "dgram"
import { setupSocketIO } from "./socket"
import { errorHandler } from "./presentation/middlewares/errorMiddleware";




const app: Application = express();
const server=createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000  ', 
    methods: ["GET", "POST"],
    credentials: true,
    
  },
});


setupSocketIO(io)
app.use(express.json());
app.use(logger);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
)

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key", 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
)
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});


cron.schedule("0 0 * * *", async () => {
  console.log("Running cleanup of unverified users");
  await cleanupUnverifiedUsers();
});

app.use(passport.initialize());
app.use(passport.session())
app.use('/uploads', express.static('public/uploads'));

app.use('/auth',authRoutes)
app.use('/classroom',classroomRoute)
app.use("/admin", adminRoutes);
app.use("/messages",messageRoute)
app.use("/whiteboard",whiteboardRoute)
app.use("/document",documentRoute)


app.use(errorHandler);

const port= process.env.PORT || 5000

connectToDatabase() 
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is running on :${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database", error);
    process.exit(1); 
  });