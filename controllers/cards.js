const Card = require("../models/card");
const DataError = require('../errors/DataError');
const DefaultError = require('../errors/DefaultError');
const NotFoundError = require('../errors/NotFoundError');
const { DefaultErrorStatus, NotFoundErrorStatus, ValidationErrorStatus } = require('../errors/ErrorCodes');

const createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message:
            "Название карточки должно быть не менее 2 символов и не более 30",
        });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((list) => {
      res.send(list);
    })
    .catch((err) => { throw new DataError('Произошла ошибка'); }
      //res.status(500).send({ message: 'Произошла ошибка' })
    );
};

const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new Error('NotFoundError')
      //res.status(404).send({ message: "Карточка не найдена" });
    })
    .then((card) => {
      Card.deleteOne(card).then(() => {
        res.send({ card });
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        // res.status(400).send({
        //   message: "Переданы некорректные данные",
        // });
        throw new DataError('Переданы некорректные данные')
      } else if (err.name === 'NotFoundError') {
        res.send({ message: 'Карточка не найдена' })
      }
      else {
        throw new DataError('Произошла ошибка');
        // res.status(500).send({ message: 'Произошла ошибка' });
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
        res.status(DefaultErrorStatus).send({ message: 'Произошла ошибка' });
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
        //  res.status(404).send({ message: "Карточка не найдена" });
        throw new Error('NotFoundError')
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        // res.status(400).send({
        //   message: "Переданы некорректные данные",
        // });
        throw new DataError('Переданы некорректные данные')
      } else {
        //  res.status(500).send({ message: 'Произошла ошибка' });
        throw new DataError('Произошла ошибка');
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
