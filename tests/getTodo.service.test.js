const { mockRequest, mockResponse } = require("jest-mock-req-res");

const db = require("../database/models");
const { getTodo } = require("../src/services/todo");

jest.mock("../database/models", () => ({
  todos: {
    findAll: jest.fn(),
  },
  subTasks: {
    findAll: jest.fn(),
  },
}));

describe("getTodo function", () => {
  test("should fetch user todos with subtasks", async () => {
    const userId = 1;

    // Mock the Todo and SubTask data
    const todosData = [
      {
        dataValues: {
          uuid: "todo-uuid-1",
        },
      },
      {
        dataValues: {
          uuid: "todo-uuid-2",
        },
      },
    ];
    const subTasksData = [
      {
        dataValues: {
          id: 1,
          description: "Subtask 1",
        },
      },
      //   {
      //     dataValues: {
      //       id: 2,
      //       description: "Subtask 2",
      //     },
      //   },
    ];

    // Mock the database queries
    db.todos.findAll.mockResolvedValue(todosData);
    db.subTasks.findAll.mockResolvedValue(subTasksData);

    // Create mock request and response objects
    const request = mockRequest({
      user: {
        userId,
      },
    });
    const response = mockResponse();

    // Call the getTodo function
    await getTodo(request, response);

    // Check the response
    expect(response.send).toHaveBeenCalledWith(todosData);
    expect(response.send).toHaveBeenCalledTimes(1);

    // Check that subTasks were added to the todo data
    expect(todosData[0].dataValues.subTasks).toEqual([
      subTasksData[0].dataValues,
    ]);
    // expect(todosData[1].dataValues.subTasks).toEqual([
    //   subTasksData[1].dataValues,
    // ]);

    // Check that the database queries were called with the correct parameters
    expect(db.todos.findAll).toHaveBeenCalledWith({ where: { userId } });
    expect(db.subTasks.findAll).toHaveBeenCalledWith({
      where: { todoID: todosData[0].dataValues.uuid },
    });
    expect(db.subTasks.findAll).toHaveBeenCalledWith({
      where: { todoID: todosData[1].dataValues.uuid },
    });
  });
});
