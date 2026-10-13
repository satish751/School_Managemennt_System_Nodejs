
import Fee from "../models/Fee.js";
import Student from "../models/Student.js";
import User from "../models/userModel.js";

// CREATE FEE (ADMIN)
export const createFee = async (req, res) => {
  try {
    const { student, amount, dueDate, status, paymentDate } = req.body;

    if (!student || amount === undefined || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Student, amount and due date are required",
      });
    }

    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than zero",
      });
    }

    const existingStudent = await Student.findById(student);

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (status && !["pending", "paid"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid fee status",
      });
    }

    const fee = await Fee.create({
      student,
      amount: Number(amount),
      dueDate,
      status: status || "pending",
      paymentDate:
        status === "paid" ? paymentDate || new Date() : undefined,
    });

    const createdFee = await Fee.findById(fee._id).populate(
      "student",
      "name email admissionNumber className"
    );

    return res.status(201).json({
      success: true,
      message: "Fee created successfully",
      fee: createdFee,
    });
  } catch (error) {
    console.error("CREATE FEE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create fee",
    });
  }
};

// GET ALL FEES (ADMIN)
export const getFees = async (req, res) => {
  try {
    const fees = await Fee.find()
      .populate("student", "name email admissionNumber className")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: fees.length,
      fees,
    });
  } catch (error) {
    console.error("GET FEES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch fees",
    });
  }
};

// GET FEE BY ID (ADMIN)
export const getFeeById = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id).populate(
      "student",
      "name email admissionNumber className"
    );

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee not found",
      });
    }

    return res.status(200).json({ success: true, fee });
  } catch (error) {
    console.error("GET FEE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch fee",
    });
  }
};

// UPDATE FEE (ADMIN)
export const updateFee = async (req, res) => {
  try {
    const { student, amount, dueDate, status, paymentDate } = req.body;
    const updates = {};

    if (student !== undefined) {
      const existingStudent = await Student.findById(student);

      if (!existingStudent) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      updates.student = student;
    }

    if (amount !== undefined) {
      if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
        return res.status(400).json({
          success: false,
          message: "Amount must be greater than zero",
        });
      }

      updates.amount = Number(amount);
    }

    if (dueDate !== undefined) updates.dueDate = dueDate;

    if (status !== undefined) {
      if (!["pending", "paid"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid fee status",
        });
      }

      updates.status = status;
      updates.paymentDate =
        status === "paid" ? paymentDate || new Date() : null;
    } else if (paymentDate !== undefined) {
      updates.paymentDate = paymentDate;
    }

    const fee = await Fee.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate("student", "name email admissionNumber className");

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fee updated successfully",
      fee,
    });
  } catch (error) {
    console.error("UPDATE FEE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update fee",
    });
  }
};

// DELETE FEE (ADMIN)
export const deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fee deleted successfully",
    });
  } catch (error) {
    console.error("DELETE FEE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete fee",
    });
  }
};

// GET MY FEES (STUDENT)
export const getMyFees = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in login token",
      });
    }

    const user = await User.findById(userId);

    if (!user || user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can view their fees",
      });
    }

    const student = await Student.findOne({
      email: user.email.trim(),
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found for this account",
      });
    }

    const fees = await Fee.find({
      student: student._id,
    }).sort({ dueDate: 1 });

    return res.status(200).json({
      success: true,
      fees,
    });
  } catch (error) {
    console.error("GET MY FEES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your fees",
    });
  }
};


// PARENT: GET CHILD'S FEES
export const getParentChildFees = async (req, res) => {
  try {
    const userId =
      req.user?.userId || req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in login token.",
      });
    }

    const parent = await User.findById(userId);

    if (!parent || parent.role !== "parent") {
      return res.status(403).json({
        success: false,
        message: "Only parents can view their child's fees.",
      });
    }

    // Find the child using the existing parent-child relationship.
    let student = await Student.findOne({
      parent: parent._id,
    });

    // Fallback for student records linked through parentName.
    if (!student && parent.name) {
      const escapedName = parent.name.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      student = await Student.findOne({
        parentName: {
          $regex: `^${escapedName}$`,
          $options: "i",
        },
      });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "No child profile found for this parent.",
      });
    }

    const fees = await Fee.find({
      student: student._id,
    }).sort({ dueDate: 1 });

    const totalFees = fees.reduce(
      (total, fee) => total + fee.amount,
      0
    );

    const paidFees = fees
      .filter((fee) => fee.status === "paid")
      .reduce((total, fee) => total + fee.amount, 0);

    const pendingFees = fees
      .filter((fee) => fee.status === "pending")
      .reduce((total, fee) => total + fee.amount, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueFees = fees
      .filter((fee) => {
        const dueDate = new Date(fee.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        return (
          fee.status === "pending" &&
          dueDate < today
        );
      })
      .reduce((total, fee) => total + fee.amount, 0);

    return res.status(200).json({
      success: true,
      student: {
        _id: student._id,
        name: student.name,
        admissionNumber: student.admissionNumber,
        className: student.className,
        section: student.section,
      },
      summary: {
        totalFees,
        paidFees,
        pendingFees,
        overdueFees,
      },
      count: fees.length,
      fees,
    });
  } catch (error) {
    console.error("GET PARENT CHILD FEES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch child's fees.",
    });
  }
};
