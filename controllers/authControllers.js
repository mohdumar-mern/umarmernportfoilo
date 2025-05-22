import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";

import Auth from "../models/authModel.js";

// Register Admin
export const register = expressAsyncHandler(async (req, res) => {
  // Handle express-validator errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  //  Extract fields from request body
  const { username, email, password } = req.body;

  //  Check if admin with same email or username exists
  const existingEmail = await Auth.findOne({ email });

  if (existingEmail) {
    return res.status(400).json({ message: "Admin already exists" });
  }

  // Step 4: Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Step 5: Create new admin
  const newAdmin = await Auth.create({
    username,
    email,
    password: hashedPassword,
  });

  // Step 6: Respond with success or failure
  if (newAdmin) {
    return res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
      },
    });
  } else {
    return res.status(500).json({ message: "Failed to register admin" });
  }
});

// Login Admin
export const login = expressAsyncHandler(async (req, res) => {
  // Handle express-validator errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  //  Extract login credentials from request
  const { email, password } = req.body;

  //  Check if email exists
  const admin = await Auth.findOne({ email }).select("+password");

  if (!admin) {
    return res
      .status(404)
      .json({ message: "Email not found, please register first" });
  }

  // Ensure password is stored in DB
  if (!admin.password) {
    return res
      .status(500)
      .json({ message: "Admin account is missing a password" });
  }

  //  Compare entered password with hashed one
  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Step 6: Generate JWT token
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  // Step 7: Respond with token and admin info
  return res.status(200).json({
    message: "Login successful",
    token,
    admin: {
      id: admin._id,
      username: admin.username,
      email: admin.email,
    },
  });
});
