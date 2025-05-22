import Service from "../models/servicesModel.js";
import expressAsyncHandler from "express-async-handler";

// @desc   Add Single Service
// @route  POST /api/services/add
// @access Public
export const addService = expressAsyncHandler(async (req, res) => {

  const { title, description, category, status } = req.body;

  // Check for uploaded file
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: "No service image uploaded",
    });
  }

  // Get file url and public_id from Cloudinary upload response
  const fileUrl = req.file.path || req.file.url;
  const public_id = req.file.public_id || req.file.filename || null;

  // Create new Service document
  const service = new Service({
    title,
    description,
    category,
    status: status || "active",
    file: {
      url: fileUrl,
      public_id,
    },
  });

  try {
    const savedService = await service.save();
    res.status(201).json({ data: savedService });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc   Get all Services
// @route  GET /api/services
// @access Public
export const getServices = expressAsyncHandler(async (req, res) => {
  const services = await Service.find();

  if (!services || services.length === 0) {
    return res.status(404).json({ message: "Services not found" });
  }
  res.status(200).json({ data: services });
});

// @desc   Get Single Service by ID
// @route  GET /api/services/:id/view
// @access Public
export const getSingleService = expressAsyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }
  res.status(200).json({ data: service });
});

// @desc   Update Service
// @route  PUT /api/services/:id/edit
// @access Public
export const updateService = expressAsyncHandler(async (req, res) => {
  const { title, description, category, status } = req.body;

  const service = await Service.findById(req.params.id);
  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }

  // Variables to hold file data if new file uploaded
  let fileUrl = service.file.url;
  let public_id = service.file.public_id;

  if (req.file) {
    fileUrl = req.file.path || req.file.url;
    public_id = req.file.public_id || req.file.filename || null;
  }

  // Update service fields
  const updatedService = await Service.findByIdAndUpdate(
    req.params.id,
    {
      title: title || service.title,
      description: description || service.description,
      category: category || service.category,
      status: status || service.status,
      image: {
        url: fileUrl,
        public_id,
      },
    },
    { new: true, runValidators: true }
  );

  if (!updatedService) {
    return res.status(400).json({ message: "Failed to update service" });
  }
  return res.status(200).json({ data: updatedService });
});

// @desc   Delete Service
// @route  DELETE /api/services/:id
// @access Public
export const deleteService = expressAsyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }
  res.status(200).json({ message: "Service deleted successfully" });
});
