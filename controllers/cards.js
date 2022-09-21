const Card = require("../models/card");

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
          message: `Название карточки должно быть не менее 2 символов и не более 30`,
        });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err}` });
      }
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((list) => {
      res.send(list);
    })
    .catch((err) =>
      res.status(500).send({ message: `Произошла ошибка: ${err}` })
    );
};

const deleteCard = (req, res) => {
  Card.findOneAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res.status(404).send({ message: "Карточка не найдена" });
      }
    })
    .catch((err) =>
      res.status(500).send({ message: `Произошла ошибка: ${err}` })
    );
};

const setLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true, runValidators: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
        //res.status(404).send({ message: "Карточка не найдена" });
      }
      res.send(card);
    })
    .catch((err) => {
      if (err === "CastError") {
        throw new BadRequestError('Переданы некорректные данные для постановки лайка.');
       // res.status(400).send({
      //    message: "Переданы некорректные данные",
       // });
      }
      throw err;
     //   res.status(500).send({ message: `Произошла ошибка: ${err}` });

    });
};

const removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true, runValidators: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
       // res.status(404).send({ message: "Карточка не найдена" });
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError('Переданы некорректные данные для снятия лайка.');
        // res.status(400).send({
        //   message: "Переданы некорректные данные",
        // });
      }
      throw err;
      //  res.status(500).send({ message: `Произошла ошибка: ${err}` });

    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  setLike,
  removeLike,
};
