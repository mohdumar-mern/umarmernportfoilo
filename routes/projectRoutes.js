import express from "express";

const router = express.Router();

import upload from "../middlewares/multerMiddleware.js"
import {
  addProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { protect } from "../middlewares/authMiddleware.js";

router.get("/", getProjects);

router.post("/add",upload.single("file"),protect, addProject);
router.get("/:id/view",protect, getProjectById);
router.put("/:id/edit",upload.single("file"),protect, updateProject);
router.delete("/:id",protect, deleteProject);

export default router;
