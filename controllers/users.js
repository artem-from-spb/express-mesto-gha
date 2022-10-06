const User = require("../models/user");
const {
  DefaultErrorStatus,
  NotFoundErrorStatus,
  ValidationErrorStatus,
  ErrorConflict,
  UnauthorizedError
} = require("../errors/ErrorCodes");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ErrorConflict('Этот email уже используется')
      }
      return bcrypt.hash(password, 10)
        .then((hash) => User.create({ name, about, avatar, email, password: hash, }))
        .then((user) => User.findOne({ _id: user._id }))
        .then((user) => res.send(user));
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

const getUserMe = (req, res) => {
  User.findById(req.user._id)
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
}

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

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        ///////////////////////////////////////////
        throw new AuthError('Пользователь с таки email не загеристрирован');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // хеши не совпали — отклоняем промис
            throw new AuthError('Неверный email или пароль');
          }
          // аутентификация успешна
          const token = jwt.sign({ _id: user._id }, 'login-secret-key', {
            expiresIn: '7d',
          });
          res.status(200).send({ token });
        });
    })
    .catch(next);
};



module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  login,
  getUserMe
};
