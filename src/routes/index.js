const express = require("express");
const { requireGoogleAuth } = require("../middlewares/auth");

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
router.use("/", googleRoutes);
router.use("/api", authRoutes);
router.use("/api", requireGoogleAuth, protectedRoutes);

module.exports = routes;
