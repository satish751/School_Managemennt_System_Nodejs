
import Result from "../models/Result.js";
import Student from "../models/Student.js";
import User from "../models/userModel.js";
import Teacher from "../models/Teacher.js";
import SchoolClass from "../models/Class.js";
// CREATE RESULT
export const createResult = async (req, res) => {
  try {
    const {
      student,
      className,
      subject,
      marks,
      examType,
      academicYear,
    } = req.body;

    if (!student || !className || !subject ||
      marks === undefined || !examType || !academicYear) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required result fields",
      });
    }

    const existingStudent = await Student.findById(student);

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const result = await Result.create({
      student,
      className,
      subject,
      marks,
      examType,
      academicYear,
    });

    const createdResult = await Result.findById(result._id)
      .populate("student", "name email admissionNumber");

    return res.status(201).json({
      success: true,
      message: "Result created successfully",
      result: createdResult,
    });
  } catch (error) {
    console.error("CREATE RESULT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create result",
    });
  }
};

// GET ALL RESULTS (ADMIN)
export const getResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate("student", "name email admissionNumber")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("GET RESULTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch results",
    });
  }
};

// GET RESULT BY ID (ADMIN)
export const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate("student", "name email admissionNumber");

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("GET RESULT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch result",
    });
  }
};

// UPDATE RESULT (ADMIN)
export const updateResult = async (req, res) => {
  try {
    const { student } = req.body;

    if (student) {
      const existingStudent = await Student.findById(student);

      if (!existingStudent) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }
    }

    const result = await Result.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("student", "name email admissionNumber");

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Result updated successfully",
      result,
    });
  } catch (error) {
    console.error("UPDATE RESULT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update result",
    });
  }
};

// DELETE RESULT (ADMIN)
export const deleteResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Result deleted successfully",
    });
  } catch (error) {
    console.error("DELETE RESULT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete result",
    });
  }
};

// GET MY RESULTS (STUDENT)
export const getMyResults = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in login token",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found",
      });
    }

    if (user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can view their results",
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

    const results = await Result.find({
      student: student._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("GET MY RESULTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch results",
    });
  }
};


// TEACHER: ADD OR UPDATE STUDENT RESULT
export const addTeacherResult = async (req, res) => {
  try {
    const userId =
      req.user?.userId || req.user?._id || req.user?.id;

    const {
      student,
      className,
      section,
      subject,
      marks,
      examType,
      academicYear,
    } = req.body;

    if (
      !student ||
      !className ||
      !section ||
      !subject ||
      marks === undefined ||
      !examType ||
      !academicYear
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required result fields.",
      });
    }

    const numericMarks = Number(marks);

    if (
      !Number.isFinite(numericMarks) ||
      numericMarks < 0 ||
      numericMarks > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Marks must be between 0 and 100.",
      });
    }

    const validExamTypes = [
      "Unit Test",
      "Mid Term",
      "Final Exam",
    ];

    if (!validExamTypes.includes(examType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid exam type.",
      });
    }

    const teacher = await Teacher.findOne({ user: userId });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher profile not found.",
      });
    }

    // Verify teacher's assigned class, section, subject and year
    const assignedClass = await SchoolClass.findOne({
      className: className.trim(),
      section: section.trim(),
      subject: subject.trim(),
      academicYear: academicYear.trim(),
      classTeacher: teacher._id,
    });

    if (!assignedClass) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this class and subject.",
      });
    }

    const existingStudent = await Student.findOne({
      _id: student,
      className,
      section,
    });

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found in this class and section.",
      });
    }

    // Update an existing result for this exam, or create a new one
    const result = await Result.findOneAndUpdate(
      {
        student,
        className,
        subject,
        examType,
        academicYear,
      },
      {
        student,
        className,
        subject,
        marks: numericMarks,
        examType,
        academicYear,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    ).populate("student", "name email admissionNumber");

    return res.status(200).json({
      success: true,
      message: "Student result saved successfully.",
      result,
    });
  } catch (error) {
    console.error("ADD TEACHER RESULT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to save student result.",
    });
  }
};


// TEACHER: GET STUDENTS AND THEIR RESULTS FOR AN ASSIGNED CLASS
export const getTeacherClassResults = async (req, res) => {
  try {
    const userId =
      req.user?.userId || req.user?._id || req.user?.id;

    const {
      className,
      section,
      subject,
      examType,
      academicYear,
    } = req.query;

    if (
      !className ||
      !section ||
      !subject ||
      !examType ||
      !academicYear
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide class, section, subject, exam type and academic year.",
      });
    }

    const teacher = await Teacher.findOne({ user: userId });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher profile not found.",
      });
    }

    const assignedClass = await SchoolClass.findOne({
      className,
      section,
      subject,
      academicYear,
      classTeacher: teacher._id,
    });

    if (!assignedClass) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this class and subject.",
      });
    }

    const students = await Student.find({
      className,
      section,
    }).sort({ name: 1 });

    const results = await Result.find({
      className,
      subject,
      examType,
      academicYear,
      student: { $in: students.map((s) => s._id) },
    }).populate("student", "name email admissionNumber");

    const resultMap = new Map(
      results.map((result) => [
        result.student._id.toString(),
        result,
      ])
    );

    const data = students.map((student) => {
      const result = resultMap.get(student._id.toString());

      return {
        studentId: student._id,
        name: student.name,
        admissionNumber: student.admissionNumber,
        marks: result ? result.marks : "",
        resultId: result ? result._id : null,
      };
    });

    return res.status(200).json({
      success: true,
      count: data.length,
      results: data,
    });
  } catch (error) {
    console.error("GET TEACHER CLASS RESULTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch class results.",
    });
  }
};


// TEACHER: GET ALL SUBJECT RESULTS FOR ONE STUDENT
export const getTeacherStudentResults = async (req, res) => {
  try {
    const userId =
      req.user?.userId || req.user?._id || req.user?.id;

    const { studentId } = req.params;

    const teacher = await Teacher.findOne({ user: userId });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher profile not found.",
      });
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    // Confirm this teacher is assigned to the student's class
    const assignedClasses = await SchoolClass.find({
      classTeacher: teacher._id,
      className: student.className,
      section: student.section,
    });

    if (assignedClasses.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this student's class.",
      });
    }

    // Only return results for subjects and academic years
    // assigned to this teacher for this student's class.
    const assignedSubjects = [
      ...new Set(
        assignedClasses.map((item) => item.subject)
      ),
    ];

    const assignedYears = [
      ...new Set(
        assignedClasses.map((item) => item.academicYear)
      ),
    ];

    const results = await Result.find({
      student: student._id,
      subject: { $in: assignedSubjects },
      academicYear: { $in: assignedYears },
    }).sort({
      subject: 1,
      examType: 1,
    });

    return res.status(200).json({
      success: true,
      student: {
        _id: student._id,
        name: student.name,
        admissionNumber: student.admissionNumber,
        className: student.className,
        section: student.section,
        academicYear: assignedYears,
      },
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("GET TEACHER STUDENT RESULTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch student results.",
    });
  }
};


// PARENT: GET CHILD'S RESULTS
export const getParentChildResults = async (req, res) => {
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
        message: "Only parents can view their child's results.",
      });
    }

    // Find the child using the existing parent-child lookup approach.
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

    const results = await Result.find({
      student: student._id,
    }).sort({
      academicYear: -1,
      examType: 1,
      subject: 1,
    });

    return res.status(200).json({
      success: true,
      student: {
        _id: student._id,
        name: student.name,
        admissionNumber: student.admissionNumber,
        className: student.className,
        section: student.section,
      },
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("GET PARENT CHILD RESULTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch child's results.",
    });
  }
};
