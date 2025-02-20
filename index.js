// server.js
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors"); 
const dotenv = require("dotenv");
// const authRoutes = require("./routes/authRoutes");
// const applicantRoutes = require("./routes/applicantRoutes");
const authRoutes=require('./routes/authRoutes');
const applicantRoutes=require('./routes/applicantRoutes')
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// to check weather api working fine or not
app.get("/", async(req, res) => {
  res.send({ message: "API working fine" });
});

// Routes
app.use("/authenticate", authRoutes);
app.use("/applicant", applicantRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
