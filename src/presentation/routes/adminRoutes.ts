import { Router } from "express";
// import { adminController } from "../presentation/controllers/adminController";
import { adminController } from "../controllers/adminController";
import { verifyAdminToken } from "../middlewares/AdminMiddleware"; 
const router = Router();
const adminCtrl = new adminController();

// POST route for admin login
router.post("/login",adminCtrl.adminLogin.bind(adminCtrl))
router.get('/userManagement',verifyAdminToken,adminCtrl.getAllUsers.bind(adminCtrl))
router.post("/logout",adminCtrl.adminLogout.bind(adminCtrl));

router.put("/users/:id/toggle-block", verifyAdminToken, adminCtrl.toggleUserBlockStatus.bind(adminCtrl));

export default router;
