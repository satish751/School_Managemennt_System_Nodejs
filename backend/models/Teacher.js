
import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    employeeId: {
      type: String,
      required: true,
      unique: true,
    },

    subject: {
      type: String,
      required: true,
    },

    qualification: {
      type: String,
      required: true,
    },

    dateOfJoining: {
      type: Date,
      required: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;
