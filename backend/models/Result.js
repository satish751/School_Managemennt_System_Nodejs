
import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    className: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    marks: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    examType: {
      type: String,
      enum: ["Unit Test", "Mid Term", "Final Exam"],
      required: true,
    },

    academicYear: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Result = mongoose.model("Result", resultSchema);

export default Result;
