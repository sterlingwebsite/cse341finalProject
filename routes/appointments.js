const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const { isAuthenticated } = require("../middleware/auth");

router.get("/", async (req, res) => {
  // #swagger.tags = ['Appointments']
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  // #swagger.tags = ['Appointments']
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", isAuthenticated, async (req, res) => {
  // #swagger.tags = ['Appointments']
  /*  #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Appointment Information',
        schema: { $patientId: '60d5ec854f1a253a4c8b4567', $doctorId: '60d5ec854f1a253a4c8b4589', $appointmentDate: '2026-10-15T14:30:00.000Z', $reason: 'Annual physical examination checkup.', $status: 'Scheduled' }
  } */
  try {
    const newAppointment = new Appointment(req.body);
    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", isAuthenticated, async (req, res) => {
  // #swagger.tags = ['Appointments']
  /*  #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Updated Appointment Information',
        schema: { $patientId: '60d5ec854f1a253a4c8b4567', $doctorId: '60d5ec854f1a253a4c8b4589', $appointmentDate: '2026-10-15T15:00:00.000Z', $reason: 'Follow-up consultation regarding test results.', $status: 'Scheduled' }
  } */
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!updatedAppointment)
      return res.status(404).json({ message: "Appointment not found" });

    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", isAuthenticated, async (req, res) => {
  // #swagger.tags = ['Appointments']
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(
      req.params.id,
    );
    if (!deletedAppointment)
      return res.status(404).json({ message: "Appointment not found" });
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
