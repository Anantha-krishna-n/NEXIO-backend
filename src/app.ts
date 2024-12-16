import express,{Application} from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"
import cookieParser from "cookie-parser"
import { connectToDatabase } from "./infrastructure/databse/connection-config"
import authRoutes from "./presentation/routes/authRoutes"
// import clssRoutes
import classroomRoute from "./presentation/routes/classroomRoute"
import { cleanupUnverifiedUsers } from "./presentation/utils/cleanupUnverifiedUsers";
import cron from "node-cron";


dotenv.config()

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
)
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});


cron.schedule("0 0 * * *", async () => {
  console.log("Running cleanup of unverified users");
  await cleanupUnverifiedUsers();
});

app.use('/auth',authRoutes)
app.use('/classroom',classroomRoute)

const port= process.env.PORT || 5000

connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on :${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database", error);
    process.exit(1); 
  });