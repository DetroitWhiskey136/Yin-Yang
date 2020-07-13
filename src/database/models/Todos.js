const { makeID } = require('@utils/StringUtil');

class Todos {
  constructor(client, database) {
    this.client = client;
    this.database = database;
  }

  /**
   * Gets a users todos from the database.
   * @param {string} userID The users ID.
   * @returns {Enmap} The enmap data of the user.
   * @memberof Todos
   */
  get(userID) {
    return this.database.todos.ensure(userID, {});
  }

  /**
   * Sets a todo with a random id for the user in the database.
   * @param {string} userID The users ID.
   * @param {string} content The content of the todo.
   * @returns {Enmap} The enmap data of the user.
   * @memberof Todos
   */
  set(userID, content) {
    const userData = this.get(userID);
    let todoID = makeID(15);

    while (Object.keys(userData).includes(todoID)) {
      todoID = makeID(15);
    }

    return this.database.todos.set(userID, content, todoID);
  }

  /**
   * Updates a todo in the database.
   * @param {string} userID The user ID.
   * @param {string} todoID The todo ID.
   * @param {string} content The content of the todo.
   * @returns {Enmap} The enmap data of the user
   * @memberof Todos
   */
  update(userID, todoID, content) {
    const userData = this.get(userID);
    if (Object.keys(userData).includes(todoID)) {
      return this.database.todos.set(userID, content, todoID);
    } else {
      return new Error('That id is not in the database, Please check the id and try again.');
    }
  }


  /**
   * Deletes a todo from the database.
   * @param {string} userID The users ID.
   * @param {sting} todoID The ID of the todo.
   * @returns {Enmap} The enmap data of the user.
   * @memberof Todos
   */
  // eslint-disable-next-line no-unused-vars
  delete(userID, todoID) {
    const userData = this.get(userID);
    if (Object.keys(userData).includes(todoID)) {
      return this.database.todos.deleteProp(userID, todoID);
    } else {
      throw new Error('That id is not in the database, Please check the id and try again.');
    }
  }
}

module.exports = Todos;
