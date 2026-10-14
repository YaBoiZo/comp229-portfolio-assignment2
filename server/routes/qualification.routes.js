import { Router } from "express";
import { qualificationController } from "../controllers/qualification.controller.js";
import { requireAuthentication } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/")
  .get(qualificationController.list)
  .post(requireAuthentication, qualificationController.create)
  .delete(requireAuthentication, qualificationController.removeAll);
router.route("/:id")
  .get(qualificationController.read)
  .put(requireAuthentication, qualificationController.update)
  .delete(requireAuthentication, qualificationController.remove);

export default router;
