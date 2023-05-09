const db = require("../../database/models");

const User = db.users;
const Todo = db.todos;
const SubTask = db.subTasks;

const getTodo = async (request, response) => {
  const userId = request.user.userId;
  const usersTodo = await Todo.findAll({ where: { userId } });
  await Promise.all(
    usersTodo.map(async (singleTodo) => {
      const userSubtasks = await SubTask.findAll({
        where: { todoID: singleTodo.dataValues.uuid },
      });
      const x = [];
      userSubtasks.forEach((singleSubTask) => {
        x.push(singleSubTask.dataValues);
      });
      singleTodo.dataValues.subTasks = x;
    })
  );
  response.send(usersTodo);
};

const createTodo = async (request, response) => {
  var { title, isCompleted, dueDate } = request.body;
  if (
    typeof title !== "string" ||
    typeof isCompleted !== "boolean" ||
    typeof dueDate !== "string"
  ) {
    return response.status(400).json({ error: "Invalid data type" });
  }
  const [day, month, year] = dueDate.split("-");
  const dateObj = new Date(`20${year}`, month - 1, day);
  const isoDate = dateObj.toISOString();
  dueDate = new Date(isoDate);
  const userId = request.user.userId;
  const user = await User.findOne({ where: { userId: userId } });
  if (!user) {
    return response.status(404).send({ message: "User not found" });
  }
  const newTodo = {
    title,
    isCompleted,
    userId,
    dueDate,
  };
  await Todo.create(newTodo)
    .then((data) => response.send(data))
    .catch((err) => response.status(400).send(err));
};

const deleteTodo = async (request, response) => {
  const userId = request.user.userId;
  const { uuid } = request.params;
  //check here to see if the authenticated user deleting is their own todo
  const todo = await Todo.findOne({ where: { uuid: uuid } });
  if (userId != todo.userId) {
    return response.status(404).send({
      message: "THIS USER IS NOT ALLOWED to delete this Todo",
    });
  }
  await todo
    .destroy()
    .then(() => response.send("Todo deleted!"))
    .catch((err) => response.status(400).send(err));
};

const updateTodo = async (request, response) => {
  const { uuid } = request.params;
  const { isCompleted } = request.body;
  if (typeof isCompleted !== "boolean") {
    return response.status(400).json({ error: "Invalid data type" });
  }
  //if todo isComplete is set to TRUE, all the sub tasks related to it also becomes true.
  var subTasks = [];
  if (isCompleted == true) {
    subTasks = await SubTask.findAll({ where: { todoID: uuid } });
    subTasks.forEach(async (singleSubTask) => {
      singleSubTask.isCompleted = true;
      await singleSubTask.save();
    });
  }

  //check here to see if the authenticated user updating is their own todo
  const todo = await Todo.findOne({ where: { uuid } });
  const userId = request.user.userId;
  if (userId != todo.userId) {
    return response.status(404).send({
      message: "THIS USER IS NOT ALLOWED to make changes in this Todo",
    });
  }
  todo.isCompleted = isCompleted;
  await todo.save();
  response.send(todo);
};

module.exports = { getTodo, createTodo, deleteTodo, updateTodo };
