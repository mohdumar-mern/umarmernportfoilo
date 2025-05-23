import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import Contact from "../models/contactModel.js";
import sendEmail from "../utils/sendEmail.js";

// ✅ Submit Contact Form
export const submitContactForm = expressAsyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  
  const { name, email, phone, message } = req.body;

  const contact = await Contact.create(req.body);
  if (!contact) {
    return res
      .status(500)
      .json({ message: "Failed to save contact in database" });
  }

  // Email content
  const subject = `New Contact Message from ${name}`;
  const text = `
You received a new message from your portfolio/contact form:

Name: ${name}
Email: ${email}
Phone: ${phone}

Message:
${message}
  `;

  await sendEmail(subject, text, email);

  res.status(201).json({ message: "Message sent and saved successfully" });
});

// Get Contacts
export const getContacts = async (req, res) => {
  const { page = 1, limit = 3 } = req.query;
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const contacts = await Contact.paginate({}, options);
  
  if (!contacts || contacts.length === 0) {
    return res.status(404).json({ message: "Contacts not found" });
  }
  // Send response
  res.status(200).json({ data: contacts.docs,
    totalDocs: contacts.totalDocs,
    limit: contacts.limit,
    totalPages: contacts.totalPages,
    currentPage: contacts.page,
    pagingCounter: contacts.pagingCounter,
    hasPrevPage: contacts.hasPrevPage,
    hasNextPage: contacts.hasNextPage,
    prevPage: contacts.prevPage,
    nextPage: contacts.nextPage
   });
};

// Get contact by ID
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res
      .status(200)
      .json({ message: "Contact messge fetched successfully", contact });
  } catch (error) {
    console.error("Error fetching contact:", error.message);
    res.status(500).json({
      message: "Failed to fetch contact ",
      error: error.message,
    });
  }
};

// Delete Contact
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error.message);
    res.status(500).json({
      message: "Failed to delete contact",
      error: error.message,
    });
  }
};
