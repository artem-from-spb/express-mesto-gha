const express = require("express");
const routerUsers = require("./routes/users");
const routerCards = require("./routes/cards");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const { PORT = 3000 } = process.env;

const app = express();

//Mongoose 6 always behaves as if useNewUrlParser and useCreateIndex are true, and useFindAndModify is false.
mongoose.connect("mongodb://localhost:27017/mestodb");

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: "632823b7869e50e118ba06a8",
  };

  next();
});

app.use("/users", routerUsers);
app.use("/cards", routerCards);

app.listen(PORT, () => {
  console.log(PORT);
});
