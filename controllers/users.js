const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const DataError = require("../errors/DataError");
const ErrorConflict = require("../errors/ErrorConflict");
const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");

// const createUser = (req, res, next) => {
//   const {
//     name, about, avatar, email, password,
//   } = req.body;

//   User.findOne({ email })
//     .then((user) => {
//       if (user) {
//         throw new ErrorConflict("Этот email уже используется");
//       }
//       return bcrypt.hash(password, 10)
//         .then((hash) => User.create({
//           name, about, avatar, email, password: hash,
//         }))
//         .then((user) => User.findOne({ _id: user._id }))
//         .then((user) => res.send(user));
//     })
//     .catch((err) => {
//       if (err.name === "ValidationError") {
//         next(new DataError("Неверные данные"));
//       } else {
//         next(err);
//       }
//     });
// };

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => User.findOne({ _id: user._id }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "MongoError" || err.code === 11000) {
        next(new ErrorConflict("Пользователь с таким email уже зарегистрирован"));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new DataError(err.message));
        return;
      }
      next(err)
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((list) => {
      res.send(list);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь не найден");
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new DataError("Неверные данные"));
      } else {
        next(err);
      }
    });
};

const getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь не найден");
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new DataError("Неверные данные"));
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
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
      if (!user) {
        throw new NotFoundError("Пользователь не найден");
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new DataError("Неверные данные"));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
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
      if (!user) {
        throw new NotFoundError("Пользователь не найден");
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new DataError("Неверные данные"));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError("Пользователь с таки email не загеристрирован");
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // хеши не совпали — отклоняем промис
            throw new UnauthorizedError("Неверный email или пароль");
          }
          // аутентификация успешна
          const token = jwt.sign({ _id: user._id }, "some-secret-key", {
            expiresIn: "7d",
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
  getUserMe,
};
