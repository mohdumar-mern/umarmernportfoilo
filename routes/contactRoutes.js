import express from "express";
const router = express.Router();

// Controllers
import {
  submitContactForm,
  getContacts,
  getContactById,
  deleteContact,
} from "../controllers/contactController.js";

// Validators
import { contactFormValidator } from "../validator/contactValidator.js";

// @route   POST /api/contacts/add
// @desc    Submit contact form
// @access  Public
router.post("/add", contactFormValidator, submitContactForm);

// @route   GET /api/contacts/
// @desc    Get paginated contacts
// @access  Admin/Private (optional: protect with middleware)
router.get("/", getContacts);

// @route   GET /api/contacts/:id/view
// @desc    Get single contact by ID
// @access  Admin/Private
router.get("/:id/view", getContactById);

// @route   DELETE /api/contacts/:id
// @desc    Delete contact by ID
// @access  Admin/Private
router.delete("/:id", deleteContact);

export default router;
