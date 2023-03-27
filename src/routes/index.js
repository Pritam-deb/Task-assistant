const express = require("express");
const { requireAuth } = require("../middlewares/auth");

const protectedRoutes = require("./protectedRoutes");
const authRoutes = require("./auth");
const router = express.Router();

router.use("/", authRoutes);
router.use("/", requireAuth, protectedRoutes);

module.exports = router;
