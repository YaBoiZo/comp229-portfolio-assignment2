import { createCrudController } from "./crud.controller.js";
import { Project } from "../models/project.model.js";

export const projectController = createCrudController(Project, "Project");
