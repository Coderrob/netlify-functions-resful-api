/** @license
 * MIT License
 * Copyright (c) 2021 Rob Lindley
 */

/**
 * Typically a `*.spec.js` test file would live alongside
 * the file it tests. With the Netlify Functions all the
 * files within the functions folder get compiled and 
 * minified for deployment. We don't want tests to deploy
 * so I've added the API tests to this folder.
 * 
 * These tests are not setup for CI/CD verification. Instead
 * they're just to provide a faster way to manually verify
 * the to-dos function handler behavior.
 */

const { expect } = require("chai");
const { handler } = require("../../src/api/todos");

describe("todos", () => {
  let todoId = '';

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
      body: "{ \"task\": \"Do testing.\" }",
    };
    const response = await handler(request, {});
    expect(response.statusCode).to.equal(201);
  });

  xit("it should update a todo", async () => {
    const request = {
      path: `/.netlify/functions/todos/${todoId}`,
      httpMethod: "PATCH",
      body: "{ \"complete\": true }",
    };
    const response = await handler(request, {});
    expect(response.statusCode).to.equal(204);
  });

  xit("it should delete a todo", async () => {
    const request = {
      path: `/.netlify/functions/todos/${todoId}`,
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
