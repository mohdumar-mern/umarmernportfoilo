import expres from "express";

const router = expres.Router();

import {
  submitContactForm,
  getContacts,
  getContactById,
  deleteContact,
} from "../controllers/contactController.js";
import { contactFormValidator } from "../validator/contactValidator.js";

router.post("/add",contactFormValidator, submitContactForm)
router.get("/", getContacts)
router.get("/:id/view", getContactById)
router.delete("/:id", deleteContact)

export default router