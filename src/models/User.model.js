const { Sequalize, DataTypes, Model } = require("sequelize");
const db = require("../../config/database");
require("dotenv").config();

const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const ToDo = require("./todo.model");

const User = db.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

User.prototype.getPublicData = function () {
  const user = this;

  delete user.dataValues.token;
  delete user.dataValues.password;

  return user;
};

User.prototype.generateAuthToken = async function () {
  const user = this;
  console.log(user);
  const token = jwt.sign({ id: user.id.toString() }, process.env.JWT_KEY); //, {expiresIn:'1 days'}
  user.token = token;
  delete user.dataValues.password;
  await user.save();

  return token;
};

// // model methords
User.findByCredentials = async (email, password) => {
  const user = await User.findOne({
    where: {
      email: email,
    },
  });

  console.log(user);

  if (!user) {
    console.log("Unable to fetch user");
    throw new Error("Unable to fetch user");
  }

  console.log("password: " + user.password);
  console.log("password: " + password);
  const isMatch = await bcrypt
    .compare(password, user.password)
    .then((res) => {
      console.log("res " + res);
      return res;
    })
    .catch((err) => {
      console.log(err);
    });
  // if (!isMatch) {
  //   console.log("Password didn't match");
  //   throw new Error("Password didn't match");
  // }

  return user;
};

// User.beforeCreate(async (user) => {
//   console.log("hereaww");
//   if (user.password.isMo) {
//     user.password = await bcrypt.hash(user.password, 8);
//   }
// });

User.beforeSave(async (user) => {
  console.log("herea");
  if (user.password) {
    console.log("password" + user.password);
    user.password = await bcrypt.hash(user.password, 8);
  }
});

module.exports = User;
