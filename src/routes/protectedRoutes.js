const express = require("express");
const protectedRoutes = express.Router();
const {
  getTodo,
  createTodo,
  deleteTodo,
  updateTodo,
} = require("../services/todo");
const {
  getSubTask,
  createSubTask,
  updateSubTask,
} = require("../services/subTask");

protectedRoutes.get("/todos", getTodo);
protectedRoutes.post("/create", createTodo);
protectedRoutes.delete("/delete/:uuid", deleteTodo);
protectedRoutes.put("/update/:uuid", updateTodo);

protectedRoutes.get("/subTasks/:uuid", getSubTask);
protectedRoutes.post("/createSubTask/:uuid", createSubTask);
protectedRoutes.put("/updateSubTask/:subTaskID", updateSubTask);

module.exports = protectedRoutes;
