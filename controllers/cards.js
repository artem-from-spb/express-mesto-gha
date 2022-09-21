const Card = require("../models/card");

const createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId }).then((card) => {
    res.send({ data: card });
  });
};

const getCards = (req, res) => {
  Card.find({}).then((list) => {
    res.send(list);
  });
};

const deleteCard = (req, res) => {
  Card.findOneAndRemove(req.params.cardId).then((cards) => {
    res.send({ data: cards });
  });
};

const setLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  ).then((card) => {
    res.send({ data: card });
  });
};

const removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  ).then((card) => {
    res.send({ data: card });
  });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  setLike,
  removeLike,
};
