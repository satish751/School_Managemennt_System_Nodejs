
import SchoolClass from "../models/Class.js";
import Student from "../models/Student.js";
import User from "../models/userModel.js";
import Teacher from "../models/Teacher.js";

// Helper: escape special regex characters
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// CREATE CLASS / ASSIGN SUBJECT TO A CLASS
export const createClass = async (req, res) => {
  try {
    const {
      className,
      section,
      subject,
      academicYear,
      classTeacher,
    } = req.body;

    if (
      !className?.trim() ||
      !section?.trim() ||
      !subject?.trim() ||
      !academicYear?.trim() ||
      !classTeacher
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Class, section, subject, academic year, and teacher are required.",
      });
    }

    const existingClass = await SchoolClass.findOne({
      className: className.trim(),
      section: section.trim(),
      subject: subject.trim(),
      academicYear: academicYear.trim(),
    });

    if (existingClass) {
      return res.status(409).json({
        success: false,
        message:
          "This subject is already assigned to this class and section for the selected academic year.",
      });
    }

    const teacher = await Teacher.findById(classTeacher);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher profile not found.",
      });
    }

    const schoolClass = await SchoolClass.create({
      className: className.trim(),
      section: section.trim(),
      subject: subject.trim(),
      academicYear: academicYear.trim(),
      classTeacher: teacher._id,
    });

    const populatedClass = await SchoolClass.findById(
      schoolClass._id
    ).populate({
      path: "classTeacher",
      populate: {
        path: "user",
        select: "name email",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Class subject assigned successfully.",
      schoolClass: populatedClass,
    });
  } catch (error) {
    console.error("CREATE CLASS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL CLASS ASSIGNMENTS (ADMIN)
export const getClasses = async (req, res) => {
  try {
    const classes = await SchoolClass.find()
      .populate({
        path: "classTeacher",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .sort({ className: 1, section: 1, subject: 1 });

    return res.status(200).json({
      success: true,
      count: classes.length,
      classes,
    });
  } catch (error) {
    console.error("GET CLASSES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET CLASSES FOR LOGGED-IN STUDENT OR TEACHER
export const getMyClasses = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication information is missing.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    let query;
    let profile;

    if (String(user.role).toLowerCase() === "teacher") {
      const teacher = await Teacher.findOne({ user: user._id });

      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: "Teacher profile not found.",
        });
      }

      query = { classTeacher: teacher._id };

      profile = {
        name: user.name,
        email: user.email,
      };
    } else if (String(user.role).toLowerCase() === "student") {
      const student = await Student.findOne({
        email: user.email?.trim().toLowerCase(),
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student profile not found.",
        });
      }

      query = {
        className: student.className,
        section: student.section,
      };

      profile = {
        name: student.name,
        email: student.email,
        className: student.className,
        section: student.section,
      };
    } else {
      return res.status(403).json({
        success: false,
        message: "Only students and teachers can view My Classes.",
      });
    }

    const classes = await SchoolClass.find(query)
      .populate({
        path: "classTeacher",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .sort({ className: 1, section: 1, subject: 1 });

    return res.status(200).json({
      success: true,
      profile,
      count: classes.length,
      classes,
    });
  } catch (error) {
    console.error("GET MY CLASSES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch classes.",
      error: error.message,
    });
  }
};

// GET STUDENTS IN A TEACHER'S ASSIGNED CLASS
export const getStudentsByClass = async (req, res) => {
  try {
    const className = String(req.query.className || "").trim();
    const section = String(req.query.section || "").trim();
    const subject = String(req.query.subject || "").trim();
    const academicYear = String(req.query.academicYear || "").trim();

    if (!className || !section) {
      return res.status(400).json({
        success: false,
        message: "Class name and section are required.",
      });
    }

    const userId = req.user?.userId || req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID missing from token.",
      });
    }

    console.log("Students request:", {
      userId,
      role: req.user?.role,
      className,
      section,
      subject,
      academicYear,
    });

    const teacher = await Teacher.findOne({ user: userId });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher profile not found for this user.",
      });
    }

    const assignmentFilter = {
      classTeacher: teacher._id,
      className: {
        $regex: `^${escapeRegex(className)}$`,
        $options: "i",
      },
      section: {
        $regex: `^${escapeRegex(section)}$`,
        $options: "i",
      },
    };

    if (subject) assignmentFilter.subject = subject;
    if (academicYear) assignmentFilter.academicYear = academicYear;

    const assignment = await SchoolClass.findOne(assignmentFilter);

    if (!assignment) {
      const teacherAssignments = await SchoolClass.find({
        classTeacher: teacher._id,
      }).select("className section subject academicYear");

      console.log("Teacher assignments:", teacherAssignments);

      return res.status(403).json({
        success: false,
        message: "No matching class assignment found for this teacher.",
        requested: { className, section, subject, academicYear },
        teacherAssignments,
      });
    }

    const students = await Student.find({
      className: {
        $regex: `^${escapeRegex(className)}$`,
        $options: "i",
      },
      section: {
        $regex: `^${escapeRegex(section)}$`,
        $options: "i",
      },
    })
      .select("name email phone admissionNumber className section")
      .sort({ name: 1 });

    console.log("Students found:", students.length);

    return res.status(200).json({
      success: true,
      message: students.length
        ? "Students fetched successfully."
        : "No students match this class and section.",
      totalStudents: students.length,
      students,
    });
  } catch (error) {
    console.error("GET STUDENTS BY CLASS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch students.",
      error: error.message,
    });
  }
};

// GET CLASS ASSIGNMENT BY ID
export const getClassById = async (req, res) => {
  try {
    const schoolClass = await SchoolClass.findById(req.params.id).populate({
      path: "classTeacher",
      populate: {
        path: "user",
        select: "name email",
      },
    });

    if (!schoolClass) {
      return res.status(404).json({
        success: false,
        message: "Class assignment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      schoolClass,
    });
  } catch (error) {
    console.error("GET CLASS BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE CLASS ASSIGNMENT
export const updateClass = async (req, res) => {
  try {
    const {
      className,
      section,
      subject,
      academicYear,
      classTeacher,
    } = req.body;

    if (
      !className?.trim() ||
      !section?.trim() ||
      !subject?.trim() ||
      !academicYear?.trim() ||
      !classTeacher
    ) {
      return res.status(400).json({
        success: false,
        message: "All class assignment fields are required.",
      });
    }

    const teacher = await Teacher.findById(classTeacher);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher profile not found.",
      });
    }

    const duplicate = await SchoolClass.findOne({
      _id: { $ne: req.params.id },
      className: className.trim(),
      section: section.trim(),
      subject: subject.trim(),
      academicYear: academicYear.trim(),
    });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "This subject is already assigned to this class.",
      });
    }

    const schoolClass = await SchoolClass.findByIdAndUpdate(
      req.params.id,
      {
        className: className.trim(),
        section: section.trim(),
        subject: subject.trim(),
        academicYear: academicYear.trim(),
        classTeacher: teacher._id,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate({
      path: "classTeacher",
      populate: {
        path: "user",
        select: "name email",
      },
    });

    if (!schoolClass) {
      return res.status(404).json({
        success: false,
        message: "Class assignment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Class assignment updated successfully.",
      schoolClass,
    });
  } catch (error) {
    console.error("UPDATE CLASS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE CLASS ASSIGNMENT
export const deleteClass = async (req, res) => {
  try {
    const schoolClass = await SchoolClass.findByIdAndDelete(req.params.id);

    if (!schoolClass) {
      return res.status(404).json({
        success: false,
        message: "Class assignment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Class assignment deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE CLASS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
