import { Types } from "mongoose";
import { IDocumentRepository } from "../interfaces/repositories/IDocumentRepository";
import { DocumentRepository } from "../infrastructure/repositories/DocumentRepository";
import { Document } from "../entites/document";

export class DocumentService {
  private documentRepository: IDocumentRepository;

  constructor(documentRepository: IDocumentRepository) {
    this.documentRepository = documentRepository;
  }

  async uploadDocument(classroomId: string, adminId: string, title: string, fileUrl: string): Promise<Document> {
    const objectIdClassroomId = new Types.ObjectId(classroomId);
    const objectIdAdminId = new Types.ObjectId(adminId);
    return await this.documentRepository.uploadDocument({ classroomId:objectIdClassroomId, adminId:objectIdAdminId, title, fileUrl });
  }

  async getDocumentsByClassroom(classroomId: string): Promise<Document[]> {
    return await this.documentRepository.getDocumentsByClassroomId(classroomId);
  }
  async deleteDocument(documentId: string): Promise<boolean> {
    const objectIdDocumentId = new Types.ObjectId(documentId);
    return await this.documentRepository.deleteDocument(
      objectIdDocumentId.toHexString()
    );
  }
}
