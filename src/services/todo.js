const db = require("../../database/models");

const User = db.users;
const Todo = db.todos;

const getTodo = async (request, response) => {
  const userId = request.user.uuid;
  await Todo.findAll({ where: { userId } })
    .then((data) => response.send(data))
    .catch((err) => response.status(400).send(err));
};

const createTodo = async (request, response) => {
  const { title, isCompleted } = request.body;
  const userId = request.user.uuid;
  const user = await User.findOne({ where: { uuid: userId } });
  if (!user) {
    return response.status(404).send({ message: "User not found" });
  }
  const newTodo = {
    title,
    isCompleted,
    userId,
  };
  await Todo.create(newTodo)
    .then((data) => response.send(data))
    .catch((err) => response.status(400).send(err));
};

const deleteTodo = async (request, response) => {
  const userId = request.user.uuid;
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
  //check here to see if the authenticated user updating is their own todo
  const todo = await Todo.findOne({ where: { uuid } });
  const userId = request.user.uuid;
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
