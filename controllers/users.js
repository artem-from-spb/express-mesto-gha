const User = require("../models/user");

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar }).then((user) => {
    res.send(user);
  });
};

const getUsers = (req, res) => {
  User.find({}).then((list) => {
    res.send(list);
  });
};

const getUserId = (req, res) => {
  User.findOne({ name: 'Тестовый пользователь' }).then((user) => {
    res.send({ data: user });
  });
};

module.exports = { createUser, getUsers, getUserId };
