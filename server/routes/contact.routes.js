import { Router } from "express";
import { contactController } from "../controllers/contact.controller.js";
import { requireAuthentication } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/")
  .get(requireAuthentication, contactController.list)
  .post(contactController.create)
  .delete(requireAuthentication, contactController.removeAll);
router.route("/:id")
  .get(requireAuthentication, contactController.read)
  .put(requireAuthentication, contactController.update)
  .delete(requireAuthentication, contactController.remove);

export default router;
