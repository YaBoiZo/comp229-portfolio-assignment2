import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { requireAuthentication } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/")
  .get(requireAuthentication, userController.list)
  .post(userController.create)
  .delete(requireAuthentication, userController.removeAll);
router.route("/:id")
  .get(requireAuthentication, userController.read)
  .put(requireAuthentication, userController.update)
  .delete(requireAuthentication, userController.remove);

export default router;
