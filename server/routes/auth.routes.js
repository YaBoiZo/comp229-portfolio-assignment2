import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { requireAuthentication } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signin", authController.signIn);
router.post("/signout", authController.signOut);
router.get("/profile", requireAuthentication, authController.profile);

export default router;
