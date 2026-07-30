const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");
const { isAuthenticated } = require("../middleware/auth");

router.get("/", async (req, res) => {
  // #swagger.tags = ['Doctors']
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  // #swagger.tags = ['Doctors']
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", isAuthenticated, async (req, res) => {
  // #swagger.tags = ['Doctors']
  /*  #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Doctor Information',
        schema: { $firstName: 'Jane', $lastName: 'Smith', $specialty: 'Pediatrics', $phone: '987-654-3210', $email: 'jane.smith@clinic.com' }
  } */
  try {
    const newDoctor = new Doctor(req.body);
    const savedDoctor = await newDoctor.save();
    res.status(201).json(savedDoctor);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Email address is already in use." });
    }
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", isAuthenticated, async (req, res) => {
  // #swagger.tags = ['Doctors']
  /*  #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Updated Doctor Information',
        schema: { $firstName: 'Jane', $lastName: 'Smith', $specialty: 'Pediatrics', $phone: '987-654-3210', $email: 'jane.smith@clinic.com' }
  } */
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!updatedDoctor)
      return res.status(404).json({ message: "Doctor not found" });

    res.status(200).json(updatedDoctor);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Email address is already in use." });
    }
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", isAuthenticated, async (req, res) => {
  // #swagger.tags = ['Doctors']
  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!deletedDoctor)
      return res.status(404).json({ message: "Doctor not found" });
    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
