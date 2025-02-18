const express = require("express");
const { register, login } = require("../controllers/teacherController");
const { isTeacherAuthenticated } = require("../middlewares/teacherAuth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;
