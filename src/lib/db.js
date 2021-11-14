/** @license
 * MIT License
 * Copyright (c) 2021 Rob Lindley
 */

const fs = require("fs-extra");
const crypto = require("crypto");

/**
 * In general do _not_ use a file system to
 * act as the persistence mechanism for your
 * API. This is an example to illustrate
 * the possible async interactions with a real
 * database. Also, try Supabase.io. It's awesome
 */
const DATA_FILE_PATH = "./src/data/todos.json";

/**
 * Saves a collection of to-dos to a file.
 *
 * @param {Array} todos collection of to-do objects
 * @returns {Promise}
 */
const saveTodos = async (todos) => {
  return fs.outputJson(DATA_FILE_PATH, todos);
};

/**
 * Gets the collection of to-do items.
 *
 * @param {Object} filter parameters to filter and page the to-dos.
 * @returns {Array} collection of to-do objects
 */
const getTodos = async (filter) => {
  await fs.ensureFile(DATA_FILE_PATH);
  const todos = await fs.readJson(DATA_FILE_PATH);
  return todos ?? [];
};

/**
 * Updates a specified to-do by ID.
 *
 * @param {String} id the UUID of a specified to-do object
 * @param {Object} todo the to-do object with latest property values
 * @returns {Promise}
 */
const updateTodo = async (id, { task, complete }) => {
  const todos = await getTodos();
  await saveTodos(
    todos.map((todo) => {
      if (todo.id === id) {
        todo.task = task ?? todo.task;
        todo.complete = Boolean(complete);
      }
      return todo;
    })
  );
};

/**
 * Adds a new to-do.
 *
 * @param {Object} todo the todo object to add to the to-dos collection
 * @returns {Array} the updated collection of to-dos
 */
const addTodo = async (todo) => {
  const { task } = todo;
  const todos = await getTodos();
  todos.push({ id: crypto.randomUUID(), task, complete: false });
  await saveTodos(todos);
  return todos;
};

/**
 * Deletes a specified to-do by ID.
 *
 * @param {String} id the UUID of a specified to-do object
 * @returns {Promise}
 */
const deleteTodo = async (id) => {
  const todos = await getTodos();
  await saveTodos(todos.filter((t) => t.id !== id));
};

module.exports = {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
};
