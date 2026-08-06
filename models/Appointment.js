// models/Appointment.js
const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient ID reference is required"],
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Doctor ID reference is required"],
    },
    appointmentDate: {
      type: Date,
      required: [true, "Appointment date and time are required"],
      validate: {
        validator: function (value) {
          return value >= new Date();
        },
        message: "Appointment date cannot be scheduled in the past",
      },
    },
    reason: {
      type: String,
      required: [true, "Reason for the visit is required"],
      trim: true,
      minlength: [5, "Reason must provide context of at least 5 characters"],
    },
    status: {
      type: String,
      required: [true, "Appointment status is required"],
      trim: true,
      default: "Scheduled",
      enum: {
        values: ["Scheduled", "Completed", "Cancelled", "No Show"],
        message: "{VALUE} is not a valid appointment status status",
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
