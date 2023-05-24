const { mockRequest, mockResponse } = require("jest-mock-req-res");

const db = require("../database/models");
const { createTodo } = require("../src/services/todo");

jest.mock("../database/models", () => ({
  todos: {
    create: jest.fn(),
  },
  users: {
    findOne: jest.fn(),
  },
}));

describe("createTodo function", () => {
  test("should create a new todo", async () => {
    const userId = 1;
    const requestBody = {
      title: "New Todo",
      isCompleted: false,
      dueDate: "15-05-23",
    };

    // Mock the User data
    const user = {
      userId,
    };

    // Mock the created todo data
    const createdTodo = {
      id: 1,
      title: "New Todo??",
      isCompleted: false,
      dueDate: new Date("2023-05-15").toISOString(),
      userId,
    };

    // Mock the database queries
    db.users.findOne.mockResolvedValue(user);
    db.todos.create.mockResolvedValue(createdTodo);

    // Create mock request and response objects
    const request = mockRequest({
      body: requestBody,
      user: {
        userId,
      },
    });
    const response = mockResponse();

    // Call the createTodo function
    await createTodo(request, response);

    // Check the response
    expect(response.send).toHaveBeenCalledWith(createdTodo);
    expect(response.send).toHaveBeenCalledTimes(1);

    // Check that the todo was created with the correct data
    const expectedDueDate = new Date("2023-05-15").toISOString();

    expect(db.todos.create).toHaveBeenCalledWith({
      title: requestBody.title,
      isCompleted: requestBody.isCompleted,
      dueDate: new Date("2023-05-14T18:30:00.000Z"),
      userId,
    });

    // Check that the user was fetched from the database
    expect(db.users.findOne).toHaveBeenCalledWith({ where: { userId } });
  });

  test("should return a 404 response if user is not found", async () => {
    const userId = 1;
    const requestBody = {
      title: "New Todo",
      isCompleted: false,
      dueDate: "15-05-23",
    };

    // Mock the User data as null (user not found)
    const user = null;

    // Mock the database query
    db.users.findOne.mockResolvedValue(user);

    // Create mock request and response objects
    const request = mockRequest({
      body: requestBody,
      user: {
        userId,
      },
    });
    const response = mockResponse();

    // Call the createTodo function
    await createTodo(request, response);

    // Check the response
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.status).toHaveBeenCalledTimes(1);
    expect(response.send).toHaveBeenCalledWith({ message: "User not found" });
    expect(response.send).toHaveBeenCalledTimes(1);

    // Check that the user was fetched from the database
    expect(db.users.findOne).toHaveBeenCalledWith({ where: { userId } });
  });
});
