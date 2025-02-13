import { Schema, model } from "mongoose";
import { Document } from "../../../entites/document";

const DocumentSchema = new Schema<Document>(
  {
    classroomId: { type: Schema.Types.ObjectId, ref: "Classroom", required: true },
    adminId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export const DocumentModel = model<Document>("Document", DocumentSchema);
