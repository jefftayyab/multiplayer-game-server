const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const { createUser, getProfile, updateProfile } = require("../controllers/userController");

// To create a new user
router.post("/create", createUser);
// To get user profile
router.get("/", protect, getProfile);
// To update user profile
router.put("/update", protect, updateProfile);

module.exports = router;
