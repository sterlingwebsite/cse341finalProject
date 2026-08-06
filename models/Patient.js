// models/Patient.js
const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema(
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
    birthDate: {
      type: Date,
      required: [true, "Birth date is required"],
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: "Birth date cannot be in the future",
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
    gender: {
      type: String,
      required: [true, "Gender selection is required"],
      enum: ["Male", "Female"],
    },
    emergencyContact: {
      type: String,
      required: [true, "Emergency contact name and phone number are required"],
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Patient", PatientSchema);
