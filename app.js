const express = require("express");
const mongoose = require("mongoose");

const { PORT = 3000 } = process.env;

const app = express();

app.use("/users", (req, res) => {
  res.send(`<h1>Мы на ${PORT} порту</h1>`)
});

// подключаемся к серверу mongo
// mongoose.connect("mongodb://localhost:27017/mestodb", {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
// });

app.listen(PORT, () => {
  console.log(PORT);
});
