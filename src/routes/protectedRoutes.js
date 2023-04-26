const express = require("express");
const protectedRoutes = express.Router();
const {
  getTodo,
  createTodo,
  deleteTodo,
  updateTodo,
} = require("../services/todo");

protectedRoutes.get("/todos", getTodo);
protectedRoutes.post("/create", createTodo);
protectedRoutes.delete("/delete/:uuid", deleteTodo);
protectedRoutes.put("/update/:uuid", updateTodo);

module.exports = protectedRoutes;
