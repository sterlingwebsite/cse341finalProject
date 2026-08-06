// routes/patients.js
const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const { isAuthenticated } = require("../middleware/auth");

router.get("/", async (req, res) => {
  // #swagger.tags = ['Patients']
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  // #swagger.tags = ['Patients']
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", isAuthenticated, async (req, res) => {
  // #swagger.tags = ['Patients']
  /*  #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Patient Information',
        schema: { $firstName: 'John', $lastName: 'Doe', $birthDate: '1990-01-01', $phone: '123-456-7890', $email: 'john@example.com' }
  } */
  try {
    const newPatient = new Patient(req.body);
    const savedPatient = await newPatient.save();
    res.status(201).json(savedPatient);
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
  // #swagger.tags = ['Patients']
  /*  #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Updated Patient Information',
        schema: { $firstName: 'John', $lastName: 'Doe', $birthDate: '1990-01-01', $phone: '123-456-7890', $email: 'john@example.com' }
  } */
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!updatedPatient)
      return res.status(404).json({ message: "Patient not found" });

    res.status(200).json(updatedPatient);
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
  // #swagger.tags = ['Patients']
  try {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
    if (!deletedPatient)
      return res.status(404).json({ message: "Patient not found" });
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
