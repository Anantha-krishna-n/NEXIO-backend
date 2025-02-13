import { Router } from "express";
import { DocumentController } from "../../presentation/controllers/documentController";
import { DocumentRepository } from "../../infrastructure/repositories/DocumentRepository";
import { DocumentService } from "../../services/documentService";
import { upload } from "../../external/s3";
import { refreshTokenHandler } from "../middlewares/TokenMiddleware";

// Initialize Repository and Service
const documentRepository = new DocumentRepository();
const documentService = new DocumentService(documentRepository);
const documentController = new DocumentController(documentService);

const router = Router();

router.post(
  "/upload",
  refreshTokenHandler,
  documentController.uploadDocument.bind(documentController)
);

router.get(
  "/:classroomId",
  refreshTokenHandler,
  documentController.getDocumentsByClassroom.bind(documentController)
);


router.delete(
  "/:documentId",
  refreshTokenHandler,
  documentController.deleteDocument.bind(documentController)
);

export default router;
