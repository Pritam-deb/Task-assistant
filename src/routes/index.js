const express = require("express");
const { requireAuth } = require("../middlewares/auth");

const protectedRoutes = require("./protectedRoutes");
const authRoutes = require("./auth");
const googleRoutes = require("./googleAuth");
const router = express.Router();

const routes = (app) => {
  router.get("/", (req, res) => {
    res.json({ message: "this is a node postgres JWT auth API" });
  });
  app.use("/", router);
};
router.use("/api", googleRoutes);
router.use("/api", authRoutes);
router.use("/api", requireAuth, protectedRoutes);

module.exports = routes;
