import expressAsyncHandler from "express-async-handler";
import Project from "../models/projectModel.js";

// @desc   Add a new project
// @route  POST /api/projects
// @access Public or Protected (depends on your auth setup)
export const addProject = expressAsyncHandler(async (req, res) => {
  const { title, description, techStack, liveDemo, githubLink } = req.body;

  // Check for uploaded file
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: "No project image uploaded",
    });
  }

  const fileUrl = req.file.path || req.file.url;
  const public_id = req.file.public_id || req.file.filename || null;

  const project = new Project({
    title,
    description,
    techStack,
    liveDemo,
    githubLink,
    file: {
      public_id,
      url: fileUrl,
    },
  });

  try {
    const savedProject = await project.save();
    res.status(201).json({ data: savedProject });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc   Get all projects
// @route  GET /api/projects
// @access Public
export const getProjects = expressAsyncHandler(async (req, res) => {
  try {
    const {page = 1, limit = 3} = req.query
    // const projects = await Project.find();
    const options = {
      page: parseInt(page),
      limit: parseInt(limit)
    }
    const projects = await Project.paginate({}, options)

    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: "No projects found" });
    }

    res.status(200).json({ data: projects.docs,
      totalDocs: projects.totalDocs,
      limit: projects.limit,
      totalPages: projects.totalPages,
      currentPage: projects.page,
      pagingCounter: projects.pagingCounter,
      hasPrevPage: projects.hasPrevPage,
      hasNextPage: projects.hasNextPage,
      prevPage: projects.prevPage,
      nextPage: projects.nextPage
     });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc   Get Single Project
// @route  GET /api/projects/id
// @access Public
export const getProjectById = expressAsyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "No projects found" });
  }
  res.status(200).json({ data: project });
});

// @desc   Update Single Project
// @route  PUT /api/projects/id
// @access Public
export const updateProject = expressAsyncHandler(async (req, res) => {
  const { title, description, techStack, liveDemo, githubLink } = req.body;

  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "No projects found" });
  }

  // Declare default values from existing project
  let fileUrl = project.file?.url || "";
  let public_id = project.file?.public_id || "";

  // Check for uploaded file and overwrite if exists
  if (req.file) {
    fileUrl = req.file.path || req.file.url || fileUrl;
    public_id = req.file.public_id || req.file.filename || public_id;
  }

  // Update Project
  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    {
      title: title || project.title,
      description: description || project.description,
      techStack: techStack || project.techStack,
      liveDemo: liveDemo || project.liveDemo,
      githubLink: githubLink || project.githubLink,
      file: {
        public_id,
        url: fileUrl,
      },
    },
    { new: true, runValidators: true }
  );

  if (!updatedProject) {
    return res.status(400).json({ message: "Failed to update Project..." });
  }
  
  return res.status(201).json({ data: updatedProject });
});


// @desc   Delete Single Project
// @route  DELETE /api/projects/id
// @access Public

export const deleteProject = expressAsyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "No projects found" });
  }

  res.status(200).json({ message: "Project deleted successfully" });
});
