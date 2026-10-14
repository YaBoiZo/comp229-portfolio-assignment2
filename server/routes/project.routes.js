import { Router } from "express";
import { projectController } from "../controllers/project.controller.js";
import { requireAuthentication } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/")
  .get(projectController.list)
  .post(requireAuthentication, projectController.create)
  .delete(requireAuthentication, projectController.removeAll);
router.route("/:id")
  .get(projectController.read)
  .put(requireAuthentication, projectController.update)
  .delete(requireAuthentication, projectController.remove);

export default router;
