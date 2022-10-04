const Card = require("../models/card");
const { DefaultErrorStatus, NotFoundErrorStatus, ValidationErrorStatus } = require("../errors/ErrorCodes");

const createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ValidationErrorStatus).send({
          message:
            "Переданы некорректные данные",
        });
      } else {
        res.status(DefaultErrorStatus).send({ message: "Произошла ошибка" });
      }
    });
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

const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(NotFoundErrorStatus).send({ message: "Карточка не найдена" });
        return;
      }
      Card.deleteOne(card).then(() => {
        res.send({ card });
      });
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
