// server.js
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const axios = require("axios");
const Applicant = require("./models/Applicant"); // Adjust the path as needed
require("dotenv").config();
const { PDFDocument } = require("pdf-lib"); // Assuming pdf-text library is used
const pdfExtraction = require("pdf-extraction"); // For extracting text from PDF
const PDFExtract = require("pdf.js-extract").PDFExtract;
const PDFExtractOptions = require("pdf.js-extract").PDFExtractOptions;
const pdfExtract = new PDFExtract();

var extract = require("pdf-text-extract");
const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const prompt = "Explain how AI works";

app.get("/", async (req, resp) => {
  resp.send({ message: "Api working fine" });
});

app.post("/authenticate", (req, res) => {
  const { username, password } = req.body;
  if (username === "naval.ravikant" && password === "05111974") {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ JWT: token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.post("/enrich", async (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "No token provided" });
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });

    const { raw_text } = req.body;
    // console.log("Received text:", raw_text);

    if (!raw_text) return res.status(400).json({ error: "No data provided" });

    const prompt = `Extract the following details from the text: name, email, education (degree, branch, institution, year), experience (job_title, company), skills, and a summary. Format the output as a JSON object. Text: ${raw_text}`;

    try {
      const result = await model.generateContent(prompt);
      let data = result.response.text().trim();

      // Remove any surrounding markdown-like formatting
      data = data.replace(/^```json|```$/g, "");

      // console.log("Cleaned data:", data);

      // **Parse JSON before saving**
      const parsedData = JSON.parse(data);

      const applicant = new Applicant(parsedData); // Pass object, not string
      await applicant.save();

      res.status(200).json(parsedData);
    } catch (error) {
      // console.log("JSON Parsing Error:", error.message);
      res.status(500).json({ error: "Error parsing response data" });
    }
  });
});


app.post("/search", async (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    const { name } = req.body;
    const regex = new RegExp(name, "i");
    const applicants = await Applicant.find({ name: regex });
    if (applicants.length === 0)
      return res.status(404).json({ error: "No matching records found" });
    res.status(200).json(applicants);
  });
});

app.listen(PORT, () => {
  // console.log(`Server is running on port ${PORT}`);
});







// =
const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: false }, // Degree obtained (e.g., Bachelor of Fine Arts)
  branch: { type: String, required: false }, // Specialization or branch (e.g., Film Production)
  institution: { type: String, required: false }, // Institution name (e.g., UCLA)
  year: { type: Number, required: false }, // Year of passing
});

const experienceSchema = new mongoose.Schema({
  job_title: { type: String, required: false }, // Job title (e.g., Assistant Director)
  company: { type: String, required: false }, // Company name (e.g., Paramount Pictures)
  start_date: { type: String, required: false }, // ✅ Changed type from Date to String for flexibility
  end_date: { type: String, required: false }, // ✅ Changed type from Date to String (in case format varies)
});

const applicantSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Full name of the candidate
  email: { type: String, required: true, unique: true }, // Email of the candidate
  education: [educationSchema], // ✅ Changed from an object to an array
  experience: [experienceSchema], // ✅ Changed from an object to an array
  skills: [{ type: String }], // Array of skills (e.g., ["Cinematography", "Editing"])
  summary: { type: String, required: false }, // Summary generated by the LLM
});

const Applicant = mongoose.model("Applicant", applicantSchema);

module.exports = Applicant;
