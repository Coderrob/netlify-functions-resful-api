/** @license
 * MIT License
 * Copyright (c) 2021 Rob Lindley
 */

require("dotenv").config();
const { SUPABASE_DB_URL, SUPABASE_SERVICE_API_KEY } = process.env;
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(SUPABASE_DB_URL, SUPABASE_SERVICE_API_KEY);

/**
 * Gets the collection of to-do items.
 *
 * @param {Object} filter parameters to filter and page the to-dos.
 * @returns {Array} collection of to-do objects
 */
const getTodos = async (filter) => {
  const { data: todos } = await supabase
    .from('todos')
    .select('*')
  return todos || [];
};

/**
 * Updates a specified to-do by ID.
 *
 * @param {String} id the UUID of a specified to-do object
 * @param {Object} todo the to-do object with latest property values
 * @returns {Promise}
 */
const updateTodo = async (id, { task, complete }) => {
  const todo = { complete: Boolean(complete) }
  if (task) {
    todo['task'] = task;
  }
  await supabase
    .from('todos')
    .update(todo)
    .eq('id', id)
};

/**
 * Adds a new to-do.
 *
 * @param {Object} todo the todo object to add to the to-dos collection
 * @returns {Array} the updated collection of to-dos
 */
const addTodo = async (todo) => {
  const { task } = todo;
  await supabase
    .from("todos")
    .insert([{ task }])
  return getTodos();
};

/**
 * Deletes a specified to-do by ID.
 *
 * @param {String} id the UUID of a specified to-do object
 * @returns {Promise}
 */
const deleteTodo = async (id) => {
  await supabase.from("todos").delete().match({ id })
};

module.exports = {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
};
