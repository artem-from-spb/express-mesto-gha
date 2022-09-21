const User = require("../models/user");

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar }).then((user) => {
    res.send({ data: user });
  });
};

const getUsers = (req, res) => {
  User.find({}).then((list) => {
    res.send({ data: list });
  });
};

const getUserId = (req, res) => {
  User.findOne({ name: "Тестовый пользователь" }).then((user) => {
    res.send({ data: user._id });
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
  ).then((user) => {
    res.send({ data: user })
  })
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
  ).then((user) => {
    res.send({ data: user })
  })
};

module.exports = {
  createUser,
  getUsers,
  getUserId,
  updateProfile,
  updateAvatar,
};
