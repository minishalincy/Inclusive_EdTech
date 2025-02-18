const jwt = require("jsonwebtoken");
const Teacher = require("../models/teacher");

exports.isTeacherAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const token = authHeader.split(" ")[1];

    const data = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = data;

    const teacher = await Teacher.findById(id).select("+password");

    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: "Teacher not found",
      });
    }

    req.user = teacher;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
