const User = require("../models/user");
const { DefaultErrorStatus, NotFoundErrorStatus, ValidationErrorStatus } = require("../errors/ErrorCodes");

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ValidationErrorStatus).send({
          message:
            "Имя пользователя должно быть не менее 2 символов и не более 30",
        });
      } else {
        res.status(DefaultErrorStatus).send({ message: "Произошла ошибка" });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((list) => {
      res.send(list);
    })
    .catch((err) => res.status(DefaultErrorStatus).send({ message: `Произошла ошибка: ${err}` }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NotFoundErrorStatus).send({ message: "Пользователь не найден" });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ValidationErrorStatus).send({
          message: "Неверные данные",
        });
      } else {
        res.status(DefaultErrorStatus).send({ message: "Произошла ошибка" });
      }
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(NotFoundErrorStatus).send({ message: "Пользователь не найден" });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ValidationErrorStatus).send({
          message: "Имя пользователя / работа должны быть не менее 2 символов и не более 30",
        });
      } else {
        res.status(DefaultErrorStatus).send({ message: "Произошла ошибка" });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(NotFoundErrorStatus).send({ message: "Пользователь не найден" });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ValidationErrorStatus).send({
          message: "Переданы некорректные данные",
        });
      } else {
        res.status(DefaultErrorStatus).send({ message: "Произошла ошибка" });
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
};
