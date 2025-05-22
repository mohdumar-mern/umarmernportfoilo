import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import {
  errorHandling,
  pageNotFound,
} from "./middlewares/errorHandlingMiddleware.js";

import authRoutes from "./routes/authroutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import projectRoutes from "./routes/projectRoutes.js"
import serviceRoutes from './routes/serviceRoutes.js';
import skillRoutes from "./routes/skillRoutes.js"
import profileRoutes from './routes/profileRoutes.js'

const app = express();

// Global Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.send("Hello World");
});


// API Routes

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/profile", profileRoutes);

// 404 Handler
app.use(pageNotFound);

// Error Handling
app.use(errorHandling);

export default app;
