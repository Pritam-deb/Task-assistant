const express = require("express");
const { signUp, signIn } = require("../services/user");
const userAuth = require("../middlewares/auth");

const authRoutes = express.Router();

authRoutes.post("/signup", userAuth.saveUser, signUp);
authRoutes.post("/signin", signIn);

module.exports = authRoutes;
