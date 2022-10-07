const Card = require("../models/card");
const { DefaultErrorStatus, NotFoundErrorStatus, ValidationErrorStatus } = require("../errors/ErrorCodes");

const DataError = require("../errors/DataError");
const DefaultError = require("../errors/DefaultError");
const ErrorConflict = require("../errors/ErrorConflict");
const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .catch(() => {
      throw new DataError({ message: 'Указаны некорректные данные' });
    })
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};

const getCards = (req, res) => {
  Card.find({})
    .then((list) => {
      res.send(list);
    })
    .catch(() => {
      res.status(DefaultErrorStatus).send({ message: "Произошла ошибка" });
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError({ message: 'Нет карточки с таким id' });
      }
      Card.deleteOne(card).then(() => {
        res.send({ card });
      });
    })
    .catch(next);
};

const setLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NotFoundErrorStatus).send({ message: "Карточка не найдена" });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ValidationErrorStatus).send({
          message: "Переданы некорректные данные",
        });
      } else {
        res.status(DefaultErrorStatus).send({ message: "Произошла ошибка" });
      }
    });
};

const removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NotFoundErrorStatus).send({ message: "Карточка не найдена" });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ValidationErrorStatus).send({
          message: "Переданы некорректные данные",
        });
      } else {
        res.status(DefaultErrorStatus).send({ message: "Произошла ошибка" });
      }
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  setLike,
  removeLike,
};
