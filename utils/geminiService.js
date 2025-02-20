const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.generateContentFromText = async (raw_text) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Extract the following details from the text: name, email, education (degree, branch, institution, year), experience (job_title, company, start_date, end_date), skills, and a summary. Format the output as a JSON object. Text: ${raw_text}`;
  const result = await model.generateContent(prompt);
  let data = result.response
    .text()
    .trim()
    .replace(/^```json|```$/g, "");
  // console.log("data we get", data);
  return JSON.parse(data);
};
