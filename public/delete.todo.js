const { mockRequest, mockResponse } = require("jest-mock-req-res");

const db = require("../database/models");
const Todo = db.todos;
const { deleteTodo } = require("../src/services/todo");

describe("deleteTodo function", () => {
  it("should delete a todo", async () => {
    // Create a mock request object
    const request = mockRequest({
      user: {
        userId: 1, // Set the user ID of the authenticated user
      },
      params: {
        uuid: "afffcb3a-43a6-4afc-ad2b-4c6d5593effc", // Set the UUID of the todo to delete
      },
    });

    // Create a mock response object
    const response = mockResponse();

    // Mock the Todo model and its methods
    jest.spyOn(Todo, "findOne").mockResolvedValueOnce({
      userId: 1, // Set the user ID of the todo to delete
      destroy: jest.fn().mockResolvedValueOnce(), // Mock the destroy method
    });

    // Call the deleteTodo function
    await deleteTodo(request, response);

    // Check that the todo is deleted
    expect(response.send).toHaveBeenCalledWith("Todo deleted!");
    expect(response.status).not.toHaveBeenCalled();
  });

  it("should return an error if the user is not allowed to delete the todo", async () => {
    // Create a mock request object
    const request = mockRequest({
      user: {
        userId: 2, // Set a different user ID than the one associated with the todo
      },
      params: {
        uuid: "afffcb3a-43a6-4afc-ad2b-4c6d5593effc", // Set the UUID of the todo to delete
      },
    });

    // Create a mock response object
    const response = mockResponse();

    // Mock the Todo model and its methods
    jest.spyOn(Todo, "findOne").mockResolvedValueOnce({
      userId: 1, // Set a different user ID than the one authenticated
    });

    // Call the deleteTodo function
    await deleteTodo(request, response);

    // Check that the response status and error message are set correctly
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.send).toHaveBeenCalledWith({
      message: "THIS USER IS NOT ALLOWED to delete this Todo",
    });
  });
});
