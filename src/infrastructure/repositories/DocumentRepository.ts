import { Types } from "mongoose";
import { DocumentModel } from "../../infrastructure/databse/models/DocumentModel";
import { IDocumentRepository } from "../../interfaces/repositories/IDocumentRepository";
import { Document } from "../../entites/document";

export class DocumentRepository implements IDocumentRepository {
  async uploadDocument(documentData: Partial<Document>): Promise<Document> {
    const document = new DocumentModel(documentData);
    await document.save();
    return document.toObject();
  }

  async getDocumentsByClassroomId(classroomId: string): Promise<Document[]> {
    return await DocumentModel.find({ classroomId }).lean();
  }
  async deleteDocument(documentId: string): Promise<boolean> {
    const objectIdDocumentId = new Types.ObjectId(documentId);
    const result = await DocumentModel.findByIdAndDelete(objectIdDocumentId);

    return !!result; 
  }
}
