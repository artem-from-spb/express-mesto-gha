const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { celebrate, Joi, errors } = require("celebrate");
const cookieParser = require("cookie-parser");

const routerUsers = require("./routes/users");
const routerCards = require("./routes/cards");
const auth = require("./middlewares/auth");
const { createUser, login } = require("./controllers/users");
const NotFoundError = require("./errors/NotFoundError");

require("dotenv").config();

const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());

app.use(express.json());

// Mongoose 6 always behaves as if useNewUrlParser
// and useCreateIndex are true, and useFindAndModify is false.
mongoose.connect("mongodb://localhost:27017/mestodb");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/signin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), login);

app.post("/signup", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().pattern(
      /https?:\/\/(www\.)?[a-zA-Z\d\-.]{1,}\.[a-z]{1,6}([/a-z0-9\-._~:?#[\]@!$&'()*+,;=]*)/,
    ),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use("/users", routerUsers);
app.use("/cards", routerCards);

app.use(errors());

app.use(() => {
  throw new NotFoundError("Запрашиваемый ресурс не найден");
});

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? "На сервере произошла ошибка"
        : message,
    });
  next();
});

app.listen(PORT, () => console.log(PORT));
