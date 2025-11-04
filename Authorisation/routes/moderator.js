const express = require("express");
const { verifyToken, permit } = require("../middleware/auth");
const router = express.Router();

router.get("/manage", verifyToken, permit("Moderator"), (req, res) => {
  res.json({ message: "Welcome, Moderator! Manage users here." });
});

module.exports = router;
