const express = require("express");
const { verifyToken, permit } = require("../middleware/auth");
const router = express.Router();

router.get("/dashboard", verifyToken, permit("Admin"), (req, res) => {
  res.json({ message: "Welcome to the Admin Dashboard!" });
});

module.exports = router;
