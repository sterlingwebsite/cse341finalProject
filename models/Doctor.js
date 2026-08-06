// models/Doctor.js
const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
    },
    specialty: {
      type: String,
      required: [true, "Specialty is required"],
      trim: true,
      enum: {
        values: [
          "Cardiology",
          "Dermatology",
          "Pediatrics",
          "General Medicine",
          "Neurology",
          "Orthopedics",
        ],
        message: "{VALUE} is not a supported clinical specialty",
      },
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^\+?[0-9\s\-()]{7,15}$/, "Please provide a valid phone number"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Doctor", DoctorSchema);
