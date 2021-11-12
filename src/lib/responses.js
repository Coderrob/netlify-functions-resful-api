/**
 * API error response object
 */
const ERROR_RESPONSE = {
  statusCode: 500,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    status: 500,
    errors: [
      {
        message: "Internal server error",
      },
    ],
  }),
};

/**
 * API bad request reqponse object
 */
const BAD_RESPONSE = {
  statusCode: 400,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    status: 400,
    errors: [
      {
        message: "Bad request.",
      },
    ],
  }),
};

/**
 * API path not found response
 */
const NOT_FOUND_RESPONSE = {
  statusCode: 404,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    status: 404,
  }),
};

/**
 * Creates a new API response object with a provided
 * HTTP status code and a string body as is required by
 * Netlify Functions.
 *
 * @param {Number} statusCode the HTTP status code to return
 * @param {Object} data the response body data to return
 * @returns {Object} a generic formatted response object
 */
const createResponse = (statusCode, data) => {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
};

/**
 * Gets the common successful HTTP status code associated with
 * the HTTP request methods.
 *
 * @param {String} method the HTTP request method
 */
const getStatusCode = (method) => {
  switch (method) {
    case "PUT":
    case "POST":
      return 201;
    case "PATCH":
    case "DELETE":
      return 204;
    case "GET":
    default:
      return 200;
  }
};

module.exports = {
  NOT_FOUND_RESPONSE,
  ERROR_RESPONSE,
  BAD_RESPONSE,
  createResponse,
  getStatusCode,
};
