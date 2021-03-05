const express = require("express");
const db = require("../../config/database");
const Todo = require("../models/Todos.Model");
const auth = require("../middleware/auth");

const toDorouter = express.Router();

toDorouter.get("/", auth, async (req, res) => {
  try {
    await db.sync();
    const toDos = await Todo.findAll({
      where: {
        owner: req.user.id,
      },
    });
    res.status(200).send(toDos);
  } catch (e) {
    res.status(500).send(e);
  }
});

toDorouter.get("/:id", auth, async (req, res) => {
  try {
    await db.sync();
    const toDo = await Todo.findOne({
      where: {
        id: req.params.id,
        owner: req.user.id,
      },
    });

    res.status(200).send({ toDo, message: "SUCCESS" });
  } catch (e) {
    res.status(500).send(e);
  }
});

toDorouter.post("/add", auth, async (req, res) => {
  try {
    await db.sync();
    const toDo = await Todo.create({
      ...req.body,
      owner: req.user.id,
    });
    res.status(201).send({ toDo, message: "SUCCESS" });
  } catch (e) {
    res.status(400).send(e);
  }
});

toDorouter.patch("/update/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "id",
    "todo_description",
    "todo_priority",
    "todo_completed",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    await db.sync();
    const toDo = await Todo.findOne({
      where: {
        id: req.params.id,
        owner: req.user.id,
      },
    });
    updates.forEach((update) => (toDo[update] = req.body[update]));
    await toDo.save();

    res.send({ toDo, message: "SUCCESS" });
  } catch (e) {
    res.status(400).send(e);
  }
});

toDorouter.delete("/delete/:id", auth, async (req, res) => {
  try {
    await db.sync();
    const toDo = await Todo.destroy({
      where: {
        id: req.params.id,
      },
      force: true,
    });
    res.status(201).send({ toDo, message: "SUCCESS" });
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = toDorouter;
