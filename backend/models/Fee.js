
import mongoose from "mongoose";

const feeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    paymentDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Fee = mongoose.model("Fee", feeSchema);

export default Fee;
