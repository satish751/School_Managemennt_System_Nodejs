
import Notice from "../models/Notice.js";

// CREATE NOTICE
export const createNotice = async (req, res) => {
  try {
    console.log("NOTICE BODY:", req.body);
    console.log("LOGGED USER:", req.user);

    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const notice = await Notice.create({
      title,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Notice created successfully",
      notice,
    });
  } catch (error) {
    console.error("CREATE NOTICE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET NOTICES
export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: notices.length,
      notices,
    });
  } catch (error) {
    console.error("GET NOTICES ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE NOTICE
export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    await Notice.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Notice deleted successfully",
    });
  } catch (error) {
    console.error("DELETE NOTICE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
