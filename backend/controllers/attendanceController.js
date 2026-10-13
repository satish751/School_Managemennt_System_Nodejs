
import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";
import SchoolClass from "../models/Class.js";
import Teacher from "../models/Teacher.js";
import User from "../models/userModel.js";

// Get logged-in user's database ID
const getUserId = (req) =>
  req.user?.userId || req.user?._id || req.user?.id;

// Check that the teacher is assigned to this class
const verifyTeacherAssignment = async (userId, className, section) => {
  const teacher = await Teacher.findOne({ user: userId });

  if (!teacher) {
    return { error: "Teacher profile not found.", status: 404 };
  }

  const assignment = await SchoolClass.findOne({
    className,
    section,
    classTeacher: teacher._id,
  });

  if (!assignment) {
    return {
      error: "You are not assigned to this class.",
      status: 403,
    };
  }

  return { teacher, assignment };
};

// TEACHER: MARK OR UPDATE ATTENDANCE
export const markAttendance = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { className, section, date, attendance } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    if (
      !className ||
      !section ||
      !date ||
      !Array.isArray(attendance) ||
      attendance.length === 0
    ) {
      return res.status(400).json({
        message: "Class, section, date and attendance are required.",
      });
    }

    const selectedDate = new Date(date);

    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date.",
      });
    }

    selectedDate.setUTCHours(0, 0, 0, 0);

    const assignment = await verifyTeacherAssignment(
      userId,
      className,
      section
    );

    if (assignment.error) {
      return res.status(assignment.status).json({
        message: assignment.error,
      });
    }

    const studentIds = attendance.map((item) => item.studentId);

    if (
      studentIds.some((id) => !id) ||
      new Set(studentIds.map(String)).size !== studentIds.length
    ) {
      return res.status(400).json({
        message: "Student IDs must be valid and unique.",
      });
    }

    const validStatuses = ["Present", "Absent", "Late"];

    if (
      attendance.some(
        (item) => !validStatuses.includes(item.status)
      )
    ) {
      return res.status(400).json({
        message: "Attendance status must be Present, Absent or Late.",
      });
    }

    const students = await Student.find({
      _id: { $in: studentIds },
      className,
      section,
    }).select("_id");

    if (students.length !== studentIds.length) {
      return res.status(400).json({
        message: "One or more students do not belong to this class.",
      });
    }

    const operations = attendance.map((item) => ({
      updateOne: {
        filter: {
          student: item.studentId,
          date: selectedDate,
        },
        update: {
          $set: {
            className,
            section,
            status: item.status,
            markedBy: userId,
          },
        },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(operations);

    return res.status(200).json({
      message: "Attendance saved successfully.",
      totalStudents: attendance.length,
    });
  } catch (error) {
    console.error("MARK ATTENDANCE ERROR:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Duplicate attendance record. Please retry.",
      });
    }

    return res.status(500).json({
      message: "Failed to save attendance.",
    });
  }
};

// TEACHER: GET CLASS ATTENDANCE FOR A DATE
export const getClassAttendance = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { className, section, date } = req.query;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    if (!className || !section || !date) {
      return res.status(400).json({
        message: "Class, section and date are required.",
      });
    }

    const selectedDate = new Date(date);

    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date.",
      });
    }

    selectedDate.setUTCHours(0, 0, 0, 0);

    const assignment = await verifyTeacherAssignment(
      userId,
      className,
      section
    );

    if (assignment.error) {
      return res.status(assignment.status).json({
        message: assignment.error,
      });
    }

    const students = await Student.find({
      className,
      section,
    })
      .select("name email admissionNumber className section")
      .sort({ name: 1 })
      .lean();

    const records = await Attendance.find({
      className,
      section,
      date: selectedDate,
    }).lean();

    const recordMap = new Map(
      records.map((record) => [
        String(record.student),
        record.status,
      ])
    );

    const result = students.map((student) => ({
      ...student,
      status: recordMap.get(String(student._id)) || "Present",
    }));

    return res.status(200).json({
      message: "Attendance fetched successfully.",
      totalStudents: result.length,
      attendance: result,
    });
  } catch (error) {
    console.error("GET CLASS ATTENDANCE ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch attendance.",
    });
  }
};

// TEACHER: GET ATTENDANCE REPORT
export const getAttendanceReport = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { className, section, from, to } = req.query;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    if (!className || !section || !from || !to) {
      return res.status(400).json({
        message: "Class, section, start date and end date are required.",
      });
    }

    const startDate = new Date(from);
    const endDate = new Date(to);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime()) ||
      startDate > endDate
    ) {
      return res.status(400).json({
        message: "Please provide a valid date range.",
      });
    }

    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(23, 59, 59, 999);

    const assignment = await verifyTeacherAssignment(
      userId,
      className,
      section
    );

    if (assignment.error) {
      return res.status(assignment.status).json({
        message: assignment.error,
      });
    }

    const students = await Student.find({
      className,
      section,
    })
      .select("name admissionNumber")
      .sort({ name: 1 })
      .lean();

    const report = await Attendance.aggregate([
      {
        $match: {
          className,
          section,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$student",
          present: {
            $sum: {
              $cond: [{ $eq: ["$status", "Present"] }, 1, 0],
            },
          },
          absent: {
            $sum: {
              $cond: [{ $eq: ["$status", "Absent"] }, 1, 0],
            },
          },
          late: {
            $sum: {
              $cond: [{ $eq: ["$status", "Late"] }, 1, 0],
            },
          },
          totalMarked: { $sum: 1 },
        },
      },
    ]);

    const reportMap = new Map(
      report.map((item) => [String(item._id), item])
    );

    const result = students.map((student) => {
      const item = reportMap.get(String(student._id)) || {
        present: 0,
        absent: 0,
        late: 0,
        totalMarked: 0,
      };

      return {
        ...student,
        present: item.present,
        absent: item.absent,
        late: item.late,
        totalMarked: item.totalMarked,
        attendancePercentage:
          item.totalMarked > 0
            ? Math.round((item.present / item.totalMarked) * 100)
            : 0,
      };
    });

    return res.status(200).json({
      message: "Attendance report fetched successfully.",
      report: result,
    });
  } catch (error) {
    console.error("ATTENDANCE REPORT ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch attendance report.",
    });
  }
};

// STUDENT: GET MY ATTENDANCE
export const getMyAttendance = async (req, res) => {
  try {
    const userId = getUserId(req);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const student = await Student.findOne({
      email: user.email,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found.",
      });
    }

    const attendance = await Attendance.find({
      student: student._id,
    }).sort({ date: -1 });

    const totalClasses = attendance.length;

    const present = attendance.filter(
      (record) => record.status?.toLowerCase() === "present"
    ).length;

    const absent = attendance.filter(
      (record) => record.status?.toLowerCase() === "absent"
    ).length;

    const late = attendance.filter(
      (record) => record.status?.toLowerCase() === "late"
    ).length;

    const attendancePercentage =
      totalClasses > 0
        ? Number(((present / totalClasses) * 100).toFixed(2))
        : 0;

    return res.status(200).json({
      success: true,
      student: {
        id: student._id,
        name: student.name,
        admissionNumber: student.admissionNumber,
        className: student.className,
        section: student.section,
      },
      summary: {
        totalClasses,
        present,
        absent,
        late,
        attendancePercentage,
      },
      attendance,
    });
  } catch (error) {
    console.error("GET MY ATTENDANCE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch attendance.",
    });
  }
};

// PARENT: GET LINKED CHILD'S ATTENDANCE
export const getParentChildAttendance = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const parent = await User.findById(userId);

    if (!parent || parent.role !== "parent") {
      return res.status(403).json({
        success: false,
        message: "Parent access only.",
      });
    }

    // Find child using parent reference first.
    let student = await Student.findOne({
      parent: parent._id,
    });

    // Fallback for existing records linked by parent name.
    if (!student && parent.name) {
      const escapedName = parent.name.trim().replace(
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
        message: "No child found for this parent account.",
      });
    }

    const records = await Attendance.find({
      student: student._id,
    }).sort({ date: -1 });

    const totalClasses = records.length;

    const present = records.filter(
      (record) => record.status?.toLowerCase() === "present"
    ).length;

    const absent = records.filter(
      (record) => record.status?.toLowerCase() === "absent"
    ).length;

    const late = records.filter(
      (record) => record.status?.toLowerCase() === "late"
    ).length;

    // Count Present and Late as attended.
    const attendancePercentage =
      totalClasses > 0
        ? Number(
            (((present + late) / totalClasses) * 100).toFixed(2)
          )
        : 0;

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
        totalClasses,
        present,
        absent,
        late,
        attendancePercentage,
      },
      records,
    });
  } catch (error) {
    console.error("GET PARENT CHILD ATTENDANCE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch child's attendance.",
    });
  }
};
