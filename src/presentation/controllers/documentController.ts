import { Request, Response } from "express";
import { DocumentService } from "../../services/documentService";

export class DocumentController {
  private documentService: DocumentService;

  constructor(documentService: DocumentService) {
    this.documentService = documentService;
  }

  async uploadDocument(req: Request, res: Response) {
    try {
      // if (!req.file) {
      //   return res.status(400).json({ message: "No file uploaded" });
      // }

      const { classroomId, title,fileUrl } = req.body;
      const adminId = req.userId;

      const document = await this.documentService.uploadDocument(classroomId, adminId as string, title, fileUrl);

      return res.status(201).json({ message: "Document uploaded successfully", document });
    } catch (error) {
      console.error("Error uploading document:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getDocumentsByClassroom(req: Request, res: Response) {
    try {
      const { classroomId } = req.params;
      const documents = await this.documentService.getDocumentsByClassroom(classroomId);
      return res.status(200).json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async deleteDocument(req: Request, res: Response) {
    try {
      const { documentId } = req.params; 

      const isDeleted = await this.documentService.deleteDocument(documentId);

      if (!isDeleted) {
        return res.status(404).json({ message: "Document not found" });
      }

      return res.status(200).json({
        message: "Document deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
