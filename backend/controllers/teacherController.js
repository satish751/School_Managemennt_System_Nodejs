
import Teacher from "../models/Teacher.js";
import User from "../models/userModel.js";

// =========================
// CREATE TEACHER
// =========================
export const createTeacher = async (req, res) => {
  try {
    const {
      user,
      employeeId,
      subject,
      qualification,
      dateOfJoining,
      gender,
      address,
    } = req.body;

    // Check user exists
    const existingUser = await User.findById(user);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "Teacher user not found",
      });
    }

    // Check role
    if (existingUser.role !== "teacher") {
      return res.status(400).json({
        success: false,
        message: "Selected user is not a teacher",
      });
    }

    // Check teacher profile already exists
    const existingTeacher = await Teacher.findOne({
      user,
    });

    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: "Teacher profile already exists",
      });
    }

    // Create teacher
    const teacher = await Teacher.create({
      user,
      employeeId,
      subject,
      qualification,
      dateOfJoining,
      gender,
      address,
    });

    res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      teacher,
    });
  } catch (error) {
    console.error("CREATE TEACHER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// GET ALL TEACHERS
// =========================
export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate("user", "name email phone role");

    res.status(200).json({
      success: true,
      count: teachers.length,
      teachers,
    });
  } catch (error) {
    console.error("GET TEACHERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// GET TEACHER BY ID
// =========================
export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate("user", "name email phone role");

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      success: true,
      teacher,
    });
  } catch (error) {
    console.error("GET TEACHER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// UPDATE TEACHER
// =========================
export const updateTeacher = async (req, res) => {
  try {
    const {
      user,
      employeeId,
      subject,
      qualification,
      dateOfJoining,
      gender,
      address,
    } = req.body;

    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    teacher.user = user;
    teacher.employeeId = employeeId;
    teacher.subject = subject;
    teacher.qualification = qualification;
    teacher.dateOfJoining = dateOfJoining;
    teacher.gender = gender;
    teacher.address = address;

    await teacher.save();

    const updatedTeacher = await Teacher.findById(
      teacher._id
    ).populate("user", "name email phone role");

    res.status(200).json({
      success: true,
      message: "Teacher updated successfully",
      teacher: updatedTeacher,
    });
  } catch (error) {
    console.error("UPDATE TEACHER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// DELETE TEACHER
// =========================
export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(
      req.params.id
    );

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Teacher deleted successfully",
    });
  } catch (error) {
    console.error("DELETE TEACHER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
