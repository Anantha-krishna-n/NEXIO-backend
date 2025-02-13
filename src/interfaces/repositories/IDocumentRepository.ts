import { Document } from "../../entites/document";

export interface IDocumentRepository {
  uploadDocument(documentData: Partial<Document>): Promise<Document>;
  getDocumentsByClassroomId(classroomId: string): Promise<Document[]>;
  deleteDocument(documentId: string): Promise<boolean>;
}
