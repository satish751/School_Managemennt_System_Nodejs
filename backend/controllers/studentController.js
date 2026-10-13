
import Student from "../models/Student.js";
import User from "../models/userModel.js";

// Create Student
export const createStudent = async (req, res) => {
  try {
    const { parentEmail, ...studentData } = req.body;

    let parentId = null;
    let normalizedParentEmail = "";

    if (parentEmail?.trim()) {
      normalizedParentEmail = parentEmail.trim().toLowerCase();

      const parentUser = await User.findOne({
        email: normalizedParentEmail,
        role: "parent",
      });

      if (!parentUser) {
        return res.status(400).json({
          message:
            "No registered parent account found with this email.",
        });
      }

      parentId = parentUser._id;
    }

    const student = await Student.create({
      ...studentData,
      parent: parentId,
      parentEmail: normalizedParentEmail,
    });

    res.status(201).json({
      message: "Student created successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create student",
      error: error.message,
    });
  }
};

// Get All Students
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch students",
      error: error.message,
    });
  }
};

// Get Single Student
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch student",
      error: error.message,
    });
  }
};

// Update Student
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      message: "Student updated successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update student",
      error: error.message,
    });
  }
};

// Delete Student
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete student",
      error: error.message,
    });
  }
};

// Get logged-in student's own profile
export const getMyStudentProfile = async (req, res) => {
  try {
    const userId =
      req.user?.userId || req.user?._id || req.user?.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const student = await Student.findOne({
      email: user.email,
    });

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found",
      });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("GET MY STUDENT PROFILE ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch student profile",
      error: error.message,
    });
  }
};

// Get linked child for logged-in parent


export const getMyChild = async (req, res) => {
  try {
    const userId =
      req.user?.userId ||
      req.user?._id ||
      req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const parentUser = await User.findById(userId);

    if (!parentUser || parentUser.role !== "parent") {
      return res.status(403).json({
        message: "Parent access only",
      });
    }

    // Find child using the parent's registered name.
    const parentName = parentUser.name?.trim();

    if (!parentName) {
      return res.status(400).json({
        message: "Parent name is missing from the account",
      });
    }

    const student = await Student.findOne({
      parentName: {
        $regex: `^${parentName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        $options: "i",
      },
    });

    if (!student) {
      return res.status(404).json({
        message: "No student found for this parent name",
      });
    }

    return res.status(200).json(student);
  } catch (error) {
    console.error("getMyChild error:", error);

    return res.status(500).json({
      message: "Failed to fetch student data",
    });
  }
};

