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
    return res.status(500).json({ message: "Failed to save contact in database" });
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
  const page = parseInt(req.query.page) || 1; // default page 1
  const limit = parseInt(req.query.limit) || 6; // default limit 6

  if (page < 1 || limit < 1) {
    return res
      .status(400)
      .json({ message: "Page and limit must be greater than 0" });
  }

  const skip = (page - 1) * limit;

  try {
    const total = await Contact.countDocuments();
    const contacts = await Contact.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Contact messages fetched successfully",
      contacts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: skip + limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching contact messages:", error.message);
    res.status(500).json({
      message: "Failed to fetch contact messages",
      error: error.message,
    });
  }
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
        return res.status(404).json({ message: 'Contact not found' });
      }
  
      res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
      console.error('Error deleting contact:', error.message);
      res.status(500).json({
        message: 'Failed to delete contact',
        error: error.message,
      });
    }
  };
  