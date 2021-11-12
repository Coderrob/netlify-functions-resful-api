const { expect } = require("chai");
const { handler } = require("../../src/api/todos");

describe("todos", () => {
  it("it should get all the todos", async () => {
    const request = {
      path: "/.netlify/functions/todos?offset=0&limit=50",
      httpMethod: "GET",
    };
    const response = await handler(request, {});
    expect(response.statusCode).to.equal(200);
  });

  it("it should add a todo", async () => {
    const request = {
      path: "/.netlify/functions/todos",
      httpMethod: "POST",
      body: '{"task": "Add a todo."}',
    };
    const response = await handler(request, {});
    expect(response.statusCode).to.equal(201);
  });

  it("it should update a todo", async () => {
    const request = {
      path: "/.netlify/functions/todos/2aa9cdcd-a2bd-47f8-bfc4-08475bde1e4b",
      httpMethod: "PATCH",
      body: '{"complete": true}',
    };
    const response = await handler(request, {});
    expect(response.statusCode).to.equal(204);
  });

  it("it should delete a todo", async () => {
    const request = {
      path: "/.netlify/functions/todos/2aa9cdcd-a2bd-47f8-bfc4-08475bde1e4b",
      httpMethod: "DELETE",
    };
    const response = await handler(request, {});
    expect(response.statusCode).to.equal(204);
  });

  it("it should return a page not found", async () => {
    const request = {
      path: "/.netlify/functions/todos/1234567",
      httpMethod: "GET",
    };
    const response = await handler(request, {});
    expect(response.statusCode).to.equal(404);
  });
});
