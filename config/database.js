const { Sequelize } = require("sequelize");

module.exports = new Sequelize("todo-app", "postgres", "1234", {
  host: "localhost",
  dialect: "postgres",
});
