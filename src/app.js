const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const toDoroute = require("./routes/todo.Routes");
const userRoute = require("./routes/user.Routes");

app.use(cors());
app.use(bodyParser.json());
app.use("/todos", toDoroute);
app.use("/users", userRoute);

module.exports = app;
