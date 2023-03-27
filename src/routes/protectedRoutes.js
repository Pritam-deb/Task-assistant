const express = require("express");
const protectedRoutes = express.Router();
const { getTodo, createTodo } = require("../services/todo");

protectedRoutes.get("/", getTodo);
protectedRoutes.post("/create", createTodo);

module.exports = protectedRoutes;
