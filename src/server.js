const app = require("./app");
const db = require("../config/database");
require("dotenv").config();
const PORT = process.env.PORT | 4000;

app.get("/", (req, res) => {
  res.send("INDEX");
});

// Test DB
db.authenticate()
  .then(() => console.log("connected DB"))
  .catch((err) => console.log(err));

app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});
