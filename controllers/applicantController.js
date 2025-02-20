const Applicant = require("../models/Applicant");
const { generateContentFromText } = require("../utils/geminiService");

exports.enrichApplicant = async (req, res) => {
  const { raw_text } = req.body;
  // console.log("raw text",raw_text);
  if (!raw_text) return res.status(400).json({ error: "No data provided" });

  try {
    const parsedData = await generateContentFromText(raw_text);
    const applicant = new Applicant(parsedData);
    await applicant.save();
    res.status(200).json(parsedData);
  } catch (error) {
    console.error("Error enriching applicant:", error);
    res.status(500).json({ error: "Error processing the applicant data" });
  }
};

exports.searchApplicant = async (req, res) => {
  const { name } = req.body;
  const regex = new RegExp(name, "i");
  const applicants = await Applicant.find({ name: regex });

  if (applicants.length === 0) {
    return res.status(404).json({ error: "No matching records found" });
  }

  res.status(200).json(applicants);
};
