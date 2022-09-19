const express = require("express");
const routerUsers = require("./routes/users");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());

app.use("/users", routerUsers);

mongoose.connect("mongodb://localhost:27017/mestodb");

app.listen(PORT, () => {
  console.log(PORT);
});
