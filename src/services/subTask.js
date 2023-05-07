const db = require("../../database/models");
const Todo = db.todos;
const SubTask = db.subTasks;

const getSubTask = async (request, response) => {
  var todoID = request.params.uuid;
  await SubTask.findAll({ where: { todoID } })
    .then((data) => response.send(data))
    .catch((err) => response.status(400).send(err));
};

const createSubTask = async (request, response) => {
  var { description, priority, isCompleted } = request.body;
  var todoID = request.params.uuid;
  console.log(`UUID OF TASK=====>`, todoID);

  const todo = await Todo.findOne({ where: { uuid: todoID } });
  if (!todo) {
    return response.status(404).send({ message: "Todo not found" });
  }
  const newSubTask = {
    description,
    priority,
    isCompleted,
    todoID,
  };
  await SubTask.create(newSubTask)
    .then((data) => response.send(data))
    .catch((err) => response.status(400).send(err));
};

const updateSubTask = async (request, response) => {
  const { subTaskID } = request.params;
  const { isCompleted } = request.body;
  const subTask = await SubTask.findOne({ where: { subTaskID } });
  const userId = request.user.userId;
  //check here to see if the authenticated user updating is their own sub-tasks

  subTask.isCompleted = isCompleted;
  await subTask.save();
  response.send(subTask);
};

module.exports = { getSubTask, createSubTask, updateSubTask };