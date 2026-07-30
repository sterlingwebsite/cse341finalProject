const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { isAuthenticated } = require("../middleware/auth");

router.get("/", async (req, res) => {
  // #swagger.tags = ['Users']
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  // #swagger.tags = ['Users']
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", isAuthenticated, async (req, res) => {
  // #swagger.tags = ['Users']
  /*  #swagger.parameters['obj'] = {
        in: 'body',
        description: 'User Information',
        schema: { $githubId: '123456', $name: 'Jane Doe', $email: 'jane@example.com', $role: 'staff' }
  } */
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "GitHub ID or Email address is already in use." });
    }
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", isAuthenticated, async (req, res) => {
  // #swagger.tags = ['Users']
  /*  #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Updated User Information',
        schema: { $githubId: '123456', $name: 'Jane Doe', $email: 'jane@example.com', $role: 'doctor' }
  } */
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "GitHub ID or Email address is already in use." });
    }
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", isAuthenticated, async (req, res) => {
  // #swagger.tags = ['Users']
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
