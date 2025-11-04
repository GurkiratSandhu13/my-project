const express = require("express");
const { verifyToken } = require("../middleware/auth");
const users = require("../models/users");
const router = express.Router();

router.get("/profile", verifyToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({
    username: user.username,
    role: user.role,
    profile: { email: `${user.username}@gmail.com`, joined: "2025-01-15" }
  });
});

module.exports = router;
