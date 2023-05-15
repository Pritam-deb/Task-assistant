const { mockRequest, mockResponse } = require("jest-mock-req-res");

const db = require("../database/models");
const {
  getTodo,
  createTodo,
  deleteTodo,
  updateTodo,
} = require("../src/services/todo");

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
      dueDate: "15-05-2023",
    };

    // Mock the User data
    const user = {
      userId,
    };

    // Mock the created todo data
    const createdTodo = {
      id: 1,
      title: "New Todo",
      isCompleted: false,
      dueDate: new Date("2023-05-15"),
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
    expect(db.todos.create).toHaveBeenCalledWith({
      title: requestBody.title,
      isCompleted: requestBody.isCompleted,
      dueDate: new Date("2023-05-15"),
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
      dueDate: "15-05-2023",
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

jest.mock("./db", () => ({
  todos: {
    findOne: jest.fn(),
  },
}));

describe("deleteTodo function", () => {
  test("should delete the todo", async () => {
    const userId = 1;
    const todoUuid = "afffcb3a-43a6-4afc-ad2b-4c6d5593effc";

    // Mock the todo data
    const todo = {
      id: 1,
      uuid: todoUuid,
      userId,
    };

    // Mock the database query
    db.todos.findOne.mockResolvedValue(todo);

    // Create mock request and response objects
    const request = mockRequest({
      user: {
        userId,
      },
      params: {
        uuid: todoUuid,
      },
    });
    const response = mockResponse();

    // Call the deleteTodo function
    await deleteTodo(request, response);

    // Check the response
    expect(response.send).toHaveBeenCalledWith("Todo deleted!");
    expect(response.send).toHaveBeenCalledTimes(1);

    // Check that the todo was deleted
    expect(todo.destroy).toHaveBeenCalled();
  });

  test("should return a 404 response if the user is not allowed to delete the todo", async () => {
    const userId = 1;
    const todoUuid = "afffcb3a-43a6-4afc-ad2b-4c6d5593effc";

    // Mock the todo data with a different user ID
    const todo = {
      id: 1,
      uuid: todoUuid,
      userId: 2, // Different user ID
    };

    // Mock the database query
    db.todos.findOne.mockResolvedValue(todo);

    // Create mock request and response objects
    const request = mockRequest({
      user: {
        userId,
      },
      params: {
        uuid: todoUuid,
      },
    });
    const response = mockResponse();

    // Call the deleteTodo function
    await deleteTodo(request, response);

    // Check the response
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.status).toHaveBeenCalledTimes(1);
    expect(response.send).toHaveBeenCalledWith({
      message: "THIS USER IS NOT ALLOWED to delete this Todo",
    });
    expect(response.send).toHaveBeenCalledTimes(1);

    // Check that the todo was not deleted
    expect(todo.destroy).not.toHaveBeenCalled();
  });
});

// Mock the Todo and SubTask models
jest.mock("./db", () => ({
  todos: {
    findOne: jest.fn(),
  },
  subTasks: {
    findAll: jest.fn(),
  },
}));

describe("updateTodo function", () => {
  test("should update the todo", async () => {
    const userId = 1;
    const todoUuid = "afffcb3a-43a6-4afc-ad2b-4c6d5593effc";
    const isCompleted = true;

    // Mock the todo data
    const todo = {
      id: 1,
      uuid: todoUuid,
      userId,
      isCompleted: !isCompleted, // Initial value is opposite of the new value
      save: jest.fn(),
    };

    // Mock the subtasks data
    const subTasks = [
      {
        id: 1,
        todoID: todoUuid,
        isCompleted: !isCompleted, // Initial value is opposite of the new value
        save: jest.fn(),
      },
      {
        id: 2,
        todoID: todoUuid,
        isCompleted: !isCompleted, // Initial value is opposite of the new value
        save: jest.fn(),
      },
    ];

    // Mock the database queries
    db.todos.findOne.mockResolvedValue(todo);
    db.subTasks.findAll.mockResolvedValue(subTasks);

    // Create mock request and response objects
    const request = mockRequest({
      user: {
        userId,
      },
      params: {
        uuid: todoUuid,
      },
      body: {
        isCompleted,
      },
    });
    const response = mockResponse();

    // Call the updateTodo function
    await updateTodo(request, response);

    // Check the response
    expect(response.send).toHaveBeenCalledWith(todo);
    expect(response.send).toHaveBeenCalledTimes(1);

    // Check that the todo's isCompleted flag was updated
    expect(todo.isCompleted).toBe(isCompleted);
    expect(todo.save).toHaveBeenCalled();

    // Check that the subtasks' isCompleted flags were updated
    expect(subTasks[0].isCompleted).toBe(isCompleted);
    expect(subTasks[0].save).toHaveBeenCalled();
    expect(subTasks[1].isCompleted).toBe(isCompleted);
    expect(subTasks[1].save).toHaveBeenCalled();
  });

  test("should return a 404 response if the user is not allowed to update the todo", async () => {
    const userId = 1;
    const todoUuid = "afffcb3a-43a6-4afc-ad2b-4c6d5593effc";
    const isCompleted = true;

    // Mock the todo data with a different user ID
    const todo = {
      id: 1,
      uuid: todoUuid,
      userId: 2, // Different user ID
    };

    // Mock the database queries
    db.todos.findOne.mockResolvedValue(todo);

    // Create mock request and response objects
    const request = mockRequest({
      user: {
        userId,
      },
      params: {
        uuid: todoUuid,
      },
      body: {
        isCompleted,
      },
    });
    const response = mockResponse();

    // Call the updateTodo function
    await updateTodo(request, response);

    // Check

    // Call the updateTodo function
    await updateTodo(request, response);

    // Check that a 404 response is sent
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.status).toHaveBeenCalledTimes(1);
    expect(response.send).toHaveBeenCalledWith({
      message: "THIS USER IS NOT ALLOWED to make changes in this Todo",
    });
    expect(response.send).toHaveBeenCalledTimes(1);
  });

  test("should handle errors and send a 400 response", async () => {
    const userId = 1;
    const todoUuid = "afffcb3a-43a6-4afc-ad2b-4c6d5593effc";
    const isCompleted = true;

    // Mock the database query to throw an error
    db.todos.findOne.mockRejectedValue(new Error("Database error"));

    // Create mock request and response objects
    const request = mockRequest({
      user: {
        userId,
      },
      params: {
        uuid: todoUuid,
      },
      body: {
        isCompleted,
      },
    });
    const response = mockResponse();

    // Call the updateTodo function
    await updateTodo(request, response);

    // Check that a 400 response is sent with the error message
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.status).toHaveBeenCalledTimes(1);
    expect(response.send).toHaveBeenCalledWith({
      message: "Database error",
    });
    expect(response.send).toHaveBeenCalledTimes(1);
  });
});
