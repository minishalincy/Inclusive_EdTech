const jwt = require("jsonwebtoken");
const Parent = require("../models/parent");

exports.isParentAuthenticated = async (req, res, next) => {
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

    const parent = await Parent.findById(id).select("+password");

    if (!parent) {
      return res.status(401).json({
        success: false,
        message: "Parent not found",
      });
    }

    req.user = parent;
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
