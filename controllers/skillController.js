import expressAsyncHandler from "express-async-handler";
import Skill from "../models/skillModel.js";

// @desc   Add Single Skill
// @route  POST /api/skills/add
// @access Public
export const addSkill = expressAsyncHandler(async (req, res) => {
  const { title, level, category } = req.body;

  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: "No skill image uploaded",
    });
  }

  const fileUrl = req.file.path || req.file.url;
  const public_id = req.file.public_id || req.file.filename || null;

  const skill = new Skill({
    title,
    level,
    category,
    file: {
      url: fileUrl,
      public_id,
    },
  });

  try {
    const savedSkill = await skill.save();
    res.status(201).json({ data: savedSkill });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc   Get All Skills
// @route  GET /api/skills
// @access Public
export const getSkills = expressAsyncHandler(async (req, res) => {
  const {page = 1, limit = 3} = req.query
  const options = {
    page: parseInt(page),
    limit: parseInt(limit)
  }

  const skills = await Skill.paginate({},options);
  if (!skills || skills.length === 0) {
    return res.status(404).json({ message: "Skills not found" });
  }
  res.status(200).json({ data: skills.docs,
    totalDocs: skills.totalDocs,
    limit: skills.limit,
    totalPages: skills.totalPages,
    currentPage: skills.page,
    pagingCounter: skills.pagingCounter,
    hasPrevPage: skills.hasPrevPage,
    hasNextPage: skills.hasNextPage,
    prevPage: skills.prevPage,
    nextPage: skills.nextPage
   });
});

// @desc   Get Single Skill
// @route  GET /api/skills/:id/view
// @access Public
export const getSingleSkill = expressAsyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);
  if (!skill) {
    return res.status(404).json({ message: "Skill not found" });
  }
  res.status(200).json({ data: skill });
});

// @desc   Update Skill
// @route  PUT /api/skills/:id/edit
// @access Public
export const updateSkill = expressAsyncHandler(async (req, res) => {
  const { title, level, category } = req.body;

  const skill = await Skill.findById(req.params.id);
  if (!skill) {
    return res.status(404).json({ message: "Skill not found" });
  }

  let fileUrl = skill.file.url;
  let public_id = skill.file.public_id;

  if (req.file) {
    fileUrl = req.file.path || req.file.url;
    public_id = req.file.public_id || req.file.filename || null;
  }

  const updatedSkill = await Skill.findByIdAndUpdate(
    req.params.id,
    {
      title: title || skill.title,
      level: level || skill.level,
      category: category || skill.category,
      file: {
        url: fileUrl,
        public_id,
      },
    },
    { new: true, runValidators: true }
  );

  if (!updatedSkill) {
    return res.status(400).json({ message: "Failed to update skill..." });
  }
  return res.status(200).json({ data: updatedSkill });
});

// @desc   Delete Skill
// @route  DELETE /api/skills/:id
// @access Public
export const deleteSkill = expressAsyncHandler(async (req, res) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);
  if (!skill) {
    return res.status(404).json({ message: "Skill not found" });
  }
  res.status(200).json({ message: "Skill deleted successfully" });
});
