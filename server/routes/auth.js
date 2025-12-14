const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Signup route
router.post("/signup", async (req, res) => {
  const { name, email, userName, password } = req.body;

  if (!name || !email || !userName || !password) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  try {
    const existingUser = await USER.findOne({
      $or: [{ email: email }, { userName: userName }],
    });

    if (existingUser) {
      return res
        .status(422)
        .json({ error: "User already exists with given email or username" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new USER({
      name,
      email,
      userName,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "Successfully Signed Up" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Signin route
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Email and Password are required" });
  }

  try {
    const savedUser = await USER.findOne({ email: email });
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid Email" });
    }

    const match = await bcrypt.compare(password, savedUser.password);
    if (!match) {
      return res.status(422).json({ error: "Invalid Password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { _id: savedUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d" }
    );

    const { _id, name, email: userEmail, userName, Photo } = savedUser;

    res.status(200).json({
      message: "Signed in Successfully",
      token,
      user: { _id, name, email: userEmail, userName, Photo },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
