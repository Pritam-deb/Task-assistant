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
  const currentTodo = await Todo.findAll({
    where: { uuid: subTask.dataValues.todoID },
  });

  //check here to see if the authenticated user updating is their own sub-tasks
  if (userId != currentTodo[0].dataValues.userId) {
    return response.status(404).send({
      message: "THIS USER IS NOT ALLOWED to make changes in this Todo",
    });
  } else {
    console.log(`SUBTASK STATUS UPDATED SUCCESSFULLY!!`);
  }
  subTask.isCompleted = isCompleted;
  await subTask.save();
  response.send(subTask);
};

module.exports = { getSubTask, createSubTask, updateSubTask };
