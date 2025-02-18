// remarkController.js
const Remark = require("../models/remark");
const Classroom = require("../models/classroom");
const fs = require("fs");

exports.addMessage = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    const studentId = req.params.studentId;
    const classroomId = req.params.id;
    const { type } = req.body;

    let content;

    // Handle voice message
    if (type === "voice") {
      if (!req.files || !req.files.file) {
        return res.status(400).json({
          success: false,
          message: "Voice file is required",
        });
      }

      const voiceFile = req.files.file;
      const fileName = `voice_${Date.now()}_${studentId}.m4a`;

      // Create uploads directory if it doesn't exist
      if (!fs.existsSync("./uploads")) {
        fs.mkdirSync("./uploads", { recursive: true });
      }

      const filePath = `./uploads/${fileName}`;

      // Move the file
      await voiceFile.mv(filePath);
      content = `/uploads/${fileName}`;
    } else {
      // Handle text message
      if (!req.body.content) {
        return res.status(400).json({
          success: false,
          message: "Content is required for text messages",
        });
      }
      content = req.body.content;
    }

    let remark = await Remark.findOne({
      student: studentId,
      classroom: classroomId,
    });

    if (!remark) {
      remark = new Remark({
        student: studentId,
        classroom: classroomId,
        messages: [],
      });
    }

    // Add the message
    remark.messages.push({
      type,
      content,
      sender: "teacher",
    });

    await remark.save();

    res.status(200).json({
      success: true,
      remark,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get remark thread for a student
exports.getStudentRemark = async (req, res) => {
  try {
    const { studentId } = req.params;
    const classroomId = req.params.id;

    const remark = await Remark.findOne({
      student: studentId,
      classroom: classroomId,
    }).populate("student", "name admissionNumber");

    res.status(200).json({
      success: true,
      remark,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
