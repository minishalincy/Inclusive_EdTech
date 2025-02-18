const Teacher = require("../models/teacher");
const bcrypt = require("bcrypt");

// Register teacher
exports.register = async (req, res) => {
  try {
    const { name, email, password, school } = req.body;

    if (!name || !email || !password || !school) {
      throw new Error("All fields are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Please enter a valid email");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    const existingTeacher = await Teacher.findOne({ email });

    if (existingTeacher) {
      throw new Error("Email already registered");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newTeacher = await Teacher.create({
      name,
      email,
      password: passwordHash,
      school,
    });

    const token = newTeacher.generateToken();

    res.status(201).json({
      success: true,
      message: "Teacher registered successfully",
      token,
      user: newTeacher,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const teacher = await Teacher.findOne({ email }).select("+password");
    if (!teacher) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await teacher.comparePassword(password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = teacher.generateToken();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: teacher,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get teacher profile
exports.getProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.teacher._id).populate(
      "classrooms"
    );

    if (!teacher) {
      throw new Error("Teacher not found");
    }

    res.status(200).json({
      success: true,
      teacher,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update teacher profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, school } = req.body;
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.teacher._id,
      {
        $set: {
          name,
          school,
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      teacher: updatedTeacher,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
