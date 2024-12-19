import { Router } from "express";
// import { adminController } from "../presentation/controllers/adminController";
import { adminController } from "../controllers/adminController";
const router = Router();
const adminCtrl = new adminController();

// POST route for admin login
router.post("/login", (req, res) => adminCtrl.adminLogin(req, res));

export default router;
