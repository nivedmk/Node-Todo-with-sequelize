const { Sequalize, DataTypes, Model } = require("sequelize");
const db = require("../../config/database");

const Todo = db.define(
  "Todos",
  {
    todo_priority: {
      type: DataTypes.STRING,
    },
    todo_description: {
      type: DataTypes.STRING,
    },
    todo_completed: {
      type: DataTypes.BOOLEAN,
    },
    owner: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Todo;
