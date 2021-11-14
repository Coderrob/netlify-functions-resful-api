/** @license
 * MIT License
 * Copyright (c) 2021 Rob Lindley
 */

const crossroads = require("crossroads");
const {
  createResponse,
  getStatusCode,
  BAD_RESPONSE,
  ERROR_RESPONSE,
  NOT_FOUND_RESPONSE,
} = require("../lib/responses");
const db = require("../lib/db");
const FUNCTION_PATH = "/.netlify/functions/todos";

const handler = async (request, _context) => {
  /**
   * Destructure the request object
   *
   * @param {String} path the relative path to the invoked function
   * @param {String} httpMethod the HTTP verb used in the request
   * @param {String} body the data submitted in the request
   */
  const { path, httpMethod, body } = request;

  /**
   * Crossroads.js does not internally support async
   * operations. Need to wrap the callback functions
   * to be resolved by a promise.
   */
  const response = new Promise((resolve) => {
    crossroads.ignoreCase = true;
    crossroads.addRoute(`GET${FUNCTION_PATH}{?query}`, (query) => {
      const { offset, limit } = query;
      const filter = {
        offset: +offset || 0,
        limit: +limit || 100,
      };
      return resolve(db.getTodos(filter));
    });
    crossroads.addRoute(`POST${FUNCTION_PATH}`, () =>
      resolve(db.addTodo(JSON.parse(body)))
    );
    crossroads.addRoute(`PATCH${FUNCTION_PATH}/{id}`, (id) =>
      resolve(db.updateTodo(id, JSON.parse(body)))
    );
    crossroads.addRoute(`DELETE${FUNCTION_PATH}/{id}`, (id) =>
      resolve(db.deleteTodo(id))
    );
    /**
     * No route matched the parsed route. Handle this condition
     * when all routes were bypassed to return a 404 response.
     */
    crossroads.bypassed.add(() => {
      const error = new Error();
      error.name = "PathNotFound";
      throw error;
    });
  });

  try {
    /**
     * Attempts to match the provided path with the
     * defined crossroad routes. Passing in the HTTP
     * method and path provided to the Netlify function.
     */
    crossroads.parse(`${httpMethod}${path}`);
    const statusCode = getStatusCode(httpMethod);
    const data = await response;
    return createResponse(statusCode, data);
  } catch (error) {
    switch (error?.name) {
      case "BadRequest":
        return BAD_RESPONSE;
      case "PathNotFound":
        return NOT_FOUND_RESPONSE;
      default:
        return ERROR_RESPONSE;
    }
  }
};

module.exports = { handler };
