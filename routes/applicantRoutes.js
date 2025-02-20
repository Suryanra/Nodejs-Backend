const express = require("express");
const { enrichApplicant, searchApplicant } = require("../controllers/applicantController");
const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/enrich", verifyToken, enrichApplicant);
router.post("/search", verifyToken, searchApplicant);

module.exports = router;