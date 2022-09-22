const User = require("../models/user");

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: `Имя пользователя должно быть не менее 2 символов и не более 30`,
        });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err}` });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((list) => {
      res.send(list);
    })
    .catch((err) =>
      res.status(500).send({ message: `Произошла ошибка: ${err}` })
    );
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      res.status(404).send({ message: "Пользователь не найден" });
      return;
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({
          message: `Неверные данные (${err}))`,
        });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err}` });
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
    }
  )
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(404).send({ message: "Пользователь не найден" });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: `Имя пользователя / работа должны быть не менее 2 символов и не более 30`,
        });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err}` });
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
    }
  )
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(404).send({ message: "Пользователь не найден" });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: `Переданы некорректные данные`,
        });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err}` });
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
