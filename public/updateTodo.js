const { mockRequest, mockResponse } = require("jest-mock-req-res");

const db = require("../database/models");
const Todo = db.todos;
const SubTask = db.subTasks;
const { updateTodo } = require("../src/services/todo");

describe("updateTodo function", () => {
  it("should update a todo and its subtasks", async () => {
    // Create mock request and response objects
    const userId = 1; // Update with the user ID
    const todoUuid = "your-todo-uuid"; // Update with the todo UUID
    const isCompleted = true; // Update with the desired isCompleted value

    const request = {
      user: {
        userId,
      },
      params: {
        uuid: todoUuid,
      },
      body: {
        isCompleted,
      },
    };
    const response = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    // Mock the Sequelize queries
    Todo.findOne = jest.fn().mockResolvedValue({
      uuid: todoUuid,
      userId,
      isCompleted: false, // Assuming the initial isCompleted value is false
      save: jest.fn(), // Mock the save method
    });
    SubTask.findAll = jest.fn().mockResolvedValue([
      // Assuming subtasks exist
      { isCompleted: false, save: jest.fn() },
      { isCompleted: false, save: jest.fn() },
    ]);

    // Call the updateTodo function
    await updateTodo(request, response);

    // Check the response
    expect(response.send).toHaveBeenCalledWith(
      expect.objectContaining({ uuid: todoUuid })
    );

    // Check the todo update
    const updatedTodo = Todo.findOne.mock.results[0].value;

    updatedTodo.then(function (todo) {
      expect(todo.isCompleted).toBe(isCompleted);
      // Check the subtask updates
      expect(todo.save).toHaveBeenCalled(); // Updated expectation
    });

    const updatedSubtasks = SubTask.findAll.mock.results[0].value;
    updatedSubtasks.then(function (subtask) {
      subtask.forEach((ST) => {
        expect(ST.isCompleted).toBe(isCompleted);
        expect(ST.save).toHaveBeenCalled();
      });
    });
  });
});
