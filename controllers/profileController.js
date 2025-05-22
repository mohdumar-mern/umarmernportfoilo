import expressAsyncHandler from "express-async-handler";
import Profile from "../models/profileModel.js";

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

  try {
    const newProfile = await Profile.create({
      user: req.user._id, // associate logged-in user
      name,
      avatar,
      resume,
      socialLinks: { github, linkedin, twitter, instagram, youtube },
    });

    res.status(201).json({
      message: "Profile created successfully",
      data: newProfile,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create profile", error: error.message });
  }
});

/**
 * @desc    Get logged-in user's profile
 * @route   GET /api/profile
 * @access  Private
 */
export const getProfile = expressAsyncHandler(async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    return res.status(200).json({ data: profile });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
});

/**
 * @desc    Update an existing profile
 * @route   PUT /api/profile/:id/edit
 * @access  Private
 */
export const updateProfile = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, github, linkedin, twitter, instagram, youtube } = req.body;
  console.log(req.body)

  const profile = await Profile.findById(id);

  if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
  }

  // Optional: check ownership
  if (profile.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized to update this profile" });
  }

  const avatarFile = req.files?.avatar?.[0];
  const resumeFile = req.files?.resume?.[0];

  const avatar = avatarFile
    ? {
        url: avatarFile.path || avatarFile.location || avatarFile.url,
        public_id: avatarFile.filename || avatarFile.originalname,
      }
    : profile.avatar;

  const resume = resumeFile
    ? {
        url: resumeFile.path || resumeFile.location || resumeFile.url,
        public_id: resumeFile.filename || resumeFile.originalname,
      }
    : profile.resume;

  try {
    const updated = await Profile.findByIdAndUpdate(
      id,
      {
        name: name || profile.name,
        avatar,
        resume,
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
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
});

/**
 * @desc    Get Avatar for logged-in user
 * @route   GET /api/profile/avatar
 * @access  Private
 */
export const getAvatar = expressAsyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id });
  if (!profile) {
    return res.status(404).json({ message: "Avatar not found" });
  }
  return res.status(200).json({ avatar: profile.avatar });
});

/**
 * @desc    Get Resume for logged-in user
 * @route   GET /api/profile/resume
 * @access  Private
 */
export const getResume = expressAsyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id });
  if (!profile) {
    return res.status(404).json({ message: "Resume not found" });
  }
  return res.status(200).json({ resume: profile.resume });
});

/**
 * @desc    Get Social Links for logged-in user
 * @route   GET /api/profile/social-links
 * @access  Private
 */
export const getSocialLinks = expressAsyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id });
  if (!profile) {
    return res.status(404).json({ message: "Social Links not found" });
  }
  return res.status(200).json({ socialLinks: profile.socialLinks });
});
