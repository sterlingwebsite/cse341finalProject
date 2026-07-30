const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    githubId: {
      type: String,
      required: [true, "GitHub ID is required"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
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
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: ["admin", "doctor", "staff"],
        message:
          "{VALUE} is not a valid role (must be admin, doctor, or staff)",
      },
      default: "staff",
      lowercase: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
