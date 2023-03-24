const express = require("express");
const protectedRoutes = express.Router();
const { getTodo } = require("../services/todo");

protectedRoutes.get("/", getTodo);

module.exports = protectedRoutes;
