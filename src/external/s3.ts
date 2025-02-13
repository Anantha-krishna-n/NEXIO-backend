// s3.ts
import { S3Client } from "@aws-sdk/client-s3"; 
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
import { Request } from "express";


dotenv.config();



if (
  !process.env.AWS_ACCESS_KEY_ID ||
  !process.env.AWS_SECRET_ACCESS_KEY ||
  !process.env.AWS_REGION ||
  !process.env.AWS_S3_BUCKET_NAME
  
) {
  throw new Error("Missing required environment variables for AWS S3");
}


const s3 = new S3Client({

  region: process.env.AWS_REGION, 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, 
  },
});

const upload = multer({
  storage: multerS3({
    s3, 
    bucket: process.env.AWS_S3_BUCKET_NAME, 
    metadata: (req: Request, file: Express.Multer.File, cb: (error: any, metadata?: any) => void) => {
      cb(null, { fieldName: file.fieldname }); 
    },
    key: (req: Request, file: Express.Multer.File, cb: (error: any, key?: string) => void) => {
      cb(null, `documents/${Date.now()}-${file.originalname}`); 
    },
  }),
});

export { s3, upload };