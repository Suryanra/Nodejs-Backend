const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  degree: String,
  branch: String,
  institution: String,
  year: Number,
});

const experienceSchema = new mongoose.Schema({
  job_title: String,
  company: String,
  start_date: String,
  end_date: String,
});

const applicantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  education: [educationSchema],
  experience: [experienceSchema],
  skills: [String],
  summary: String,
});

module.exports = mongoose.model("Applicant", applicantSchema)