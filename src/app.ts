import express,{Application} from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"
import { connectToDatabase } from "./infrastructure/databse/connection-config"
// import { Server } from "https"
// import { error } from "console"
import authRoutes from "./presentation/routes/authRoutes"
dotenv.config()

const app:Application=express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});
app.use('/auth',authRoutes)


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