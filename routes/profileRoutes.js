import express from "express";
const router = express.Router();

import upload from "../middlewares/multerMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addProfile,
  getAvatar,
  getProfile,
  getResume,
  getSocialLinks,
  updateProfile,
} from "../controllers/profileController.js";

// @route   POST /api/profile/add
// @desc    Add new profile (Protected)
router.post(
  "/add",
  protect,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  addProfile
);

// @route   PUT /api/profile/:id/edit
// @desc    Update existing profile (Protected)
router.put(
  "/:id/edit",
  protect,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  updateProfile
);

// @route   GET /api/profile
// @desc    Get all profiles (Protected)
router.get("/", protect, getProfile);

// @route   GET /api/profile/:id/avatar
// @desc    Get avatar by profile ID (Protected)
router.get("/:id/avatar", protect, getAvatar);

// @route   GET /api/profile/:id/resume
// @desc    Get resume by profile ID (Protected)
router.get("/:id/resume", protect, getResume);

// @route   GET /api/profile/:id/social-links
// @desc    Get social links by profile ID (Protected)
router.get("/:id/social-links", protect, getSocialLinks);

export default router;
