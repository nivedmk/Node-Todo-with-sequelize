const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User.model");
const db = require("../../config/database");

const userRouter = express.Router();

userRouter.post("/add", async (req, res) => {
  const user = new User({
    ...req.body,
  });

  try {
    await db.sync();
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({
      user: user.getPublicData(),
      token,
      message: "SUCCESS",
    });
  } catch (e) {
    // console.log(error);
    res.status(400).send({ e, message: "error" });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    if (!user) {
      return res.status(400).send({ error: "UnMatched credentials" });
    }
    const token = await user.generateAuthToken(); //methords or instance methode
    res.send({ user, token, message: "SUCCESS" });
  } catch (e) {
    res.status(400).send(e);
  }
});

userRouter.post("/logout", auth, async (req, res) => {
  try {
    await db.sync();
    req.user.token = null;
    await req.user.save();
    res.send({ message: "SUCCESS" });
  } catch (e) {
    res.status(500).send({ message: "Something went wrong" });
  }
});

module.exports = userRouter;
