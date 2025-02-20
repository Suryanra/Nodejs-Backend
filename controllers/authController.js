const jwt = require("jsonwebtoken");

exports.authenticate = (req, res) => {
  const { username, password } = req.body;
// console.log(username,password)
  if (username === "naval.ravikant" && password === "05111974") {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.send({ JWT: token });
  }

  res.status(401).json({ error: "Invalid credentials" });
};