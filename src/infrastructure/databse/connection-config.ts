import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();  
const url = process.env.MONGO_URL
 
if (!url) {
  throw new Error("Environment variable MONGO_URL is not set");
}

export const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  } 
};