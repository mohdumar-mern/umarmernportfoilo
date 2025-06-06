import expressAsyncHandler from "express-async-handler";
import Profile from "../models/profileModel.js";
import path from "path";
import axios from "axios";

/**
 * @desc    Create a new profile
 * @route   POST /api/profile/add
 * @access  Private
 */
export const addProfile = expressAsyncHandler(async (req, res) => {
  const { name, github, linkedin, twitter, instagram, youtube } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const avatarFile = req.files?.avatar?.[0];
  const resumeFile = req.files?.resume?.[0];

  const avatar = avatarFile
    ? {
        url: avatarFile.path || avatarFile.location || avatarFile.url,
        public_id: avatarFile.filename || avatarFile.originalname,
      }
    : null;

  const resume = resumeFile
    ? {
        url: resumeFile.path || resumeFile.location || resumeFile.url,
        public_id: resumeFile.filename || resumeFile.originalname,
      }
    : null;

  const newProfile = await Profile.create({
    name,
    avatar,
    resume,
    socialLinks: { github, linkedin, twitter, instagram, youtube },
  });

  res.status(201).json({
    message: "Profile created successfully",
    data: newProfile,
  });
});

/**
 * @desc    Get profile
 * @route   GET /api/profile
 * @access  Public
 */
export const getProfile = expressAsyncHandler(async (req, res) => {
  const profile = await Profile.findOne();
  if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
  }
  res.status(200).json({ data: profile });
});

/**
 * @desc    Update an existing profile
 * @route   PUT /api/profile/:id/edit
 * @access  Private
 */
export const updateProfile = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, github, linkedin, twitter, instagram, youtube } = req.body;

  const profile = await Profile.findById(id);
  if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
  }

  const avatarFile = req.files?.avatar?.[0];
  const resumeFile = req.files?.resume?.[0];

  const updatedAvatar = avatarFile
    ? {
        url: avatarFile.path || avatarFile.location || avatarFile.url,
        public_id: avatarFile.filename || avatarFile.originalname,
      }
    : profile.avatar;

  const updatedResume = resumeFile
    ? {
        url: resumeFile.path || resumeFile.location || resumeFile.url,
        public_id: resumeFile.filename || resumeFile.originalname,
      }
    : profile.resume;

  const updatedProfile = await Profile.findByIdAndUpdate(
    id,
    {
      name: name || profile.name,
      avatar: updatedAvatar,
      resume: updatedResume,
      socialLinks: {
        github: github ?? profile.socialLinks.github,
        linkedin: linkedin ?? profile.socialLinks.linkedin,
        twitter: twitter ?? profile.socialLinks.twitter,
        instagram: instagram ?? profile.socialLinks.instagram,
        youtube: youtube ?? profile.socialLinks.youtube,
      },
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    message: "Profile updated successfully",
    data: updatedProfile,
  });
});

/**
 * @desc    Get Avatar
 * @route   GET /api/profile/avatar
 * @access  Public
 */
export const getAvatar = expressAsyncHandler(async (req, res) => {
  const profile = await Profile.findOne();
  if (!profile || !profile.avatar?.url) {
    return res.status(404).json({ message: "Avatar not found" });
  }
  res.status(200).json({ avatar: profile.avatar.url });
});

/**
 * @desc    Get Resume
 * @route   GET /api/profile/resume
 * @access  Public
 */
export const getResume = expressAsyncHandler(async (req, res) => {
  const profile = await Profile.findOne();
  if (!profile || !profile.resume?.url) {
    return res.status(404).json({ message: "Resume not found" });
  }

  // res.status(200).json({resume: profile.resume?.url});
  const fileUrl = profile.resume.url;

  // Derive a clean filename (remove query params, fallback to default)
  const fileName = path.basename(new URL(fileUrl).pathname) || "resume.pdf";

  // Download the file as a stream
  const fileResponse = await axios.get(fileUrl, { responseType: "stream" });

   // Set headers for file download
   res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
   res.setHeader("Content-Type", "application/pdf");

   // Stream file to client
   fileResponse.data.pipe(res);
  
});

/**
 * @desc    Get Social Links
 * @route   GET /api/profile/social-links
 * @access  Public
 */
export const getSocialLinks = expressAsyncHandler(async (req, res) => {
  const profile = await Profile.findOne();
  if (!profile || !profile.socialLinks) {
    return res.status(404).json({ message: "Social Links not found" });
  }
  res.status(200).json({ socialLinks: profile.socialLinks });
});
